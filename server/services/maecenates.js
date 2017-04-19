// Imports
import Joi from 'joi'
import uuid from 'node-uuid'
import Immutable from 'seamless-immutable'
import axios from 'axios'
import { slugify } from 'strman'

// Utils
import { host, PUBLIC_SUPPORTER_THRESHOLD } from '../../shared/config'
import { knex } from '../database'
import { joiValidation } from '../util/ctrlHelpers'

// Services
import {
  fetchActiveUserSubPeriods,
  fetchActiveUserSubPeriodForMaecenate,
  fetchActiveSubPeriodsForMaecenate
} from './subscriptions'
import {
  claimFiles,
  deleteUnusedFiles,
  populateMaecenatesWithMedia
} from './files'

// Schema validation of the data
// =============================
const urlRegex = /^(https?:\/\/)?[^$\/]+\..+$/i
export const schema = {
  id: Joi.string().guid(),
  title: Joi.string().required(),
  slug: Joi.string(),
  creator: Joi.string().guid(),
  logo_media: Joi.string().guid().required(),
  cover_media: Joi.string().guid().required(),
  teaser: Joi.string().min(10).max(140).required(),
  description: Joi.string().min(30).required(),
  url: Joi.string().regex(urlRegex).allow(null, ''),
  monthly_minimum: Joi.number().integer().min(1).required()
}

// Database Calls
// ==============
export const createMaecenate = (knex, userId, data) => {
  const slugCandidate = createSlug(data.title)
  const id = uuid.v1()
  data = Immutable(data)
    .set('id', id)
    .set('slug', slugCandidate)
    .set('creator', userId)

  return validateMaecenate(null, data).then(() => {
    const mediaIds = [data.logo_media, data.cover_media]

    return knex.transaction(trx => {
      const maecenate = data.without('cover', 'logo')
      return trx('maecenates').insert(maecenate).then(() => {
        return claimFiles(trx, mediaIds, 'maecenate', id)
      })
    })
    .then(() => id)
  })
}

export const updateMaecenate = (knex, id, data) => {
  const slugCandidate = createSlug(data.title)
  data = Immutable(data)
    .set('slug', slugCandidate)

  return knex('maecenates').where({ id })
  .then(([maecenate]) => {
    return validateMaecenate(maecenate, data).then(() => {
      const mediaIds = [data.logo_media, data.cover_media]

      return knex.transaction(trx => {
        const maecenate = data.without('cover', 'logo', 'id')
        return trx('maecenates').where({ id }).update(maecenate).then(() => {
          return claimFiles(trx, mediaIds, 'maecenate', id)
        }).then(() => {
          return deleteUnusedFiles(trx, 'maecenate', id, mediaIds)
        })
      })
    })
  })
}

export function fetchMaecenate (where, userId) {
  let maecenate = null

  return knex('maecenates')
  .select('*')
  .select(function () {
    supportersQuery(this).as('supporters')
  })
  .where(where).limit(1)
  .then((result) => {
    if (result.length === 0) {
      const error = { _responseStatus: 404 }
      throw error
    }
    return populateMaecenatesWithMedia(knex, result)
  })
  .then(result => {
    maecenate = result[0]
    return fetchActiveUserSubPeriodForMaecenate(knex, userId, maecenate.id)
  })
  .then(supports => ({
    maecenate: {
      ...maecenate,
      supporters: Number(maecenate.supporters) // Force number type
    },
    supports
  }))
}

export function fetchMaecenateWithoutMedia (query) {
  return knex('maecenates').where(query).limit(1).then(result => result[0])
}

export function fetchMaecenateAdminDetails (knex, query) {
  return fetchMaecenateWithoutMedia(query)
  .then(maecenate => {
    return knex('transactions')
    .sum('amount as totalEarned')
    .where({ maecenate: maecenate.id, status: 'success' })
    .then(result => ({
      id: maecenate.id,
      totalEarned: Number(result[0].totalEarned),
      supporters: Number(result[0].supporters)
    }))
  })
}

export const fetchMaecenates = (where) =>
  knex('maecenates').where(where)
    .then(maecenates => populateMaecenatesWithMedia(knex, maecenates))

export const fetchMaecenatesOverview = (knex) => {
  return knex('maecenates')
    .where('active', true)
    .where(PUBLIC_SUPPORTER_THRESHOLD, '<=', supportersQuery(knex))
}

export function fetchSupportedMaecenates (userId) {
  let subPeriods = null
  return fetchActiveUserSubPeriods(knex, userId).then(result => {
    subPeriods = result
    return fetchMaecenates(function () {
      this.where('id', 'in', subPeriods.map(o => o.maecenate))
    })
  }).then((maecenates) => ({
    maecenates,
    supports: subPeriods
  }))
}

export function fetchMaecenateSupporters (maecenateId) {
  return fetchActiveSubPeriodsForMaecenate(knex, maecenateId)
  .orderBy('subscriptions.created_at', 'desc')
  .then((supports) => {
    const userIds = supports.map(support => support.user)
    return knex('users').where('id', 'in', userIds)
      .select('first_name', 'last_name', 'email', 'country', 'zip_code', 'id')
      .then((users) => ({
        users,
        supports
      }))
  })
}

export const deactivateMaecenate = (knex, maecenateId) => {
  return knex('maecenates').where('id', maecenateId)
  .update({ active: false })
  .limit(1)
}

export function userIsAdmin (knex, maecenateId, userId) {
  return knex('maecenates').where({ id: maecenateId, creator: userId })
  .select('id')
  .then(res => res[0] ? res[0].id : false)
}

export function userIsAdminBySlug (knex, slug, userId) {
  return knex('maecenates').where({ slug, creator: userId })
  .select('id')
  .then(res => res[0] ? res[0].id : false)
}

export function userIsSupporterBySlug (knex, slug, userId, date) {
  date = date || new Date()

  const maecenateId = knex('maecenates').where({ slug })
    .limit(1)
    .select('id')

  return knex('subscriptions')
    .select('subscriptions.id')
    .innerJoin('sub_periods', 'sub_periods.subscription', 'subscriptions.id')
    .limit(1)
    .where('maecenate', maecenateId)
    .where('user', userId)
    .where('sub_periods.start', '<=', date)
    .where('sub_periods.end', '>', date)
    .then(res => Boolean(res[0]))
}

export const activeExists = (knex, maecenateId) => {
  return knex('maecenates').where({ id: maecenateId, active: true })
  .count('* as count')
  .then(res => Number(res[0].count) > 0)
}

export const fetchSupporters = (knex, maecenateId, date) => {
  date = date || new Date()
  return knex('subscriptions')
  .select('users.id')
  .innerJoin('sub_periods', 'sub_periods.subscription', 'subscriptions.id')
  .innerJoin('users', 'subscriptions.user', 'users.id')
  .where('subscriptions.maecenate', maecenateId)
  .where('sub_periods.start', '<=', date)
  .where('sub_periods.end', '>', date)
  .then(res => res.map(o => o.id))
}

export const supportersQuery = (knex, date) => {
  date = date || new Date()
  return knex.from('subscriptions')
    .count()
    .join('sub_periods', 'subscriptions.id', 'sub_periods.subscription')
    .where('sub_periods.start', '<=', date)
    .where('sub_periods.end', '>', date)
    .whereRaw('subscriptions.maecenate = maecenates.id')
}

// Helper methods
// ==============
const createSlug = (name) =>
  name && slugify(name.replace(/\//g, '-'))

const validateMaecenate = (prev, next) => {
  return joiValidation(next, schema, true).then(() => {
    if (prev === null || prev.slug !== next.slug) {
      return slugIsAvailable(next.slug)
    }
  })
}

const slugIsAvailable = (slug) => {
  return axios.head(`${host}/${slug}`)
  .then(res => false)
  .catch(res => res.status === 404)
  .then(isAvailable => {
    if (isAvailable === false) {
      const error = { title: 'validationError.alreadyTaken' }
      throw error
    }
  })
}
