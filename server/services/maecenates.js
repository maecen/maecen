// Imports
import Joi from 'joi'
import uuid from 'node-uuid'
import Immutable from 'seamless-immutable'
import mapKeys from 'lodash/mapKeys'
import axios from 'axios'
import { slugify } from 'strman'

// Utils
import { port } from '../../shared/config'
import { knex } from '../database'
import { joiValidation } from '../util/ctrlHelpers'
import { claimMedia, deleteUnusedMedia } from './media'

// Services
import {
  fetchActiveUserSubPeriods,
  fetchActiveUserSubPeriodForMaecenate,
  fetchActiveSubPeriodsForMaecenate
} from './subscriptions'

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
        return claimMedia(mediaIds, 'maecenate', id, trx)
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
          return claimMedia(mediaIds, 'maecenate', id, trx)
        }).then(() => {
          return deleteUnusedMedia('maecenate', id, mediaIds, trx)
        })
      })
    })
  })
}

export function fetchMaecenate (where, userId) {
  let maecenate = null

  return knex('maecenates').where(where).limit(1).then((result) => {
    if (result.length === 0) {
      const error = { _responseStatus: 404 }
      throw error
    }
    maecenate = result[0]
  }).then(() => {
    return Promise.all([
      knex('media').where({ id: maecenate.logo_media }).limit(1),
      knex('media').where({ id: maecenate.cover_media }).limit(1),
      fetchActiveUserSubPeriodForMaecenate(knex, userId, maecenate.id)
    ])
  }).then(([[logoMedia], [coverMedia], supports]) => {
    return {
      maecenate: {
        ...maecenate,
        logo: logoMedia,
        cover: coverMedia
      },
      supports
    }
  })
}

export function fetchMaecenateWithoutMedia (where) {
  return knex('maecenates').where(where).limit(1).then(result => result[0])
}

export function fetchMaecenates (where) {
  where = where || {}
  let maecenates = null
  return knex('maecenates').where(where).then((result) => {
    maecenates = result
    return knex('media')
      .where('obj_type', 'maecenate')
      .andWhere('obj_id', 'in', maecenates.map(obj => obj.id))
      .select('id', 'url', 'type', 'created_at')
  }).then((media) => {
    const mappedMedia = mapKeys(media, (o) => o.id)
    return maecenates.map((maecenate) => ({
      ...maecenate,
      logo: mappedMedia[maecenate.logo_media],
      cover: mappedMedia[maecenate.cover_media]
    }))
  })
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

export const activeExists = (knex, maecenateId) => {
  return knex('maecenates').where({ id: maecenateId, active: true })
  .count('* as count')
  .then(res => Number(res[0].count) > 0)
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
