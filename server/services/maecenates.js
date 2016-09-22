import Joi from 'joi'
import Immutable from 'seamless-immutable'
import mapKeys from 'lodash/mapKeys'
import { slugify } from 'strman'
import { joiValidation } from '../util/ctrlHelpers'
import { knex } from '../database'
import { claimMedia, deleteUnusedMedia } from './media'
import {
  fetchActiveUserSubPeriods,
  fetchActiveUserSubPeriodForMaecenate,
  fetchActiveSubPeriodsForMaecenate
} from './subscriptions'

// Schema validation of the data
// =============================
const urlRegex = /^(https?:\/\/)?[^$\/]+\..+$/i
const schema = {
  id: Joi.string().guid(),
  title: Joi.string().required(),
  slug: Joi.string(),
  creator: Joi.string().guid(),
  logo_media: Joi.string().guid().required(),
  cover_media: Joi.string().guid().required(),
  teaser: Joi.string().min(10).max(140).required(),
  description: Joi.string().min(30).required(),
  url: Joi.string().regex(urlRegex).allow(null, ''),
  monthly_minimum: Joi.number().required()
}

// Database Calls
// ==============
export function updateMaecenate (id, data) {
  data = Immutable(data)
    .set('slug', slugify(data.title))

  return validateMaecenate(data).then(() => {
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
}

export function fetchMaecenate (where, userId) {
  let maecenate = null

  return knex('maecenates').where(where).limit(1).then((result) => {
    maecenate = result[0]
  }).then(() => {
    return Promise.all([
      knex('media').where({ id: maecenate.logo_media }).limit(1),
      knex('media').where({ id: maecenate.cover_media }).limit(1),
      fetchActiveUserSubPeriodForMaecenate(knex, userId, maecenate.id)
    ])
  }).then(([[logoMedia], [coverMedia], supports]) => {
    console.log(supports)
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
      .select('first_name', 'country', 'id')
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

export function userHasContentAccess (maecenateId, userId) {
  return userIsAdmin()
}

export function userIsAdmin (knex, maecenateId, userId) {
  return knex('maecenates').where({ id: maecenateId, creator: userId })
  .count('* as count')
  .then(res => Number(res[0].count) > 0)
}

export const activeExists = (knex, maecenateId) => {
  return knex('maecenates').where({ id: maecenateId, active: true })
  .count('* as count')
  .then(res => Number(res[0].count) > 0)
}

// Helper methods
// ==============
function validateMaecenate (data) {
  return joiValidation(data, schema, true).then(() => {
    return knex('maecenates')
      .where({ slug: data.slug })
      .whereNot({ id: data.id })
      .count('* as count')
      .limit(1)
      .then(([ result ]) => {
        const exists = Boolean(Number(result.count))
        if (exists) {
          const error = { title: 'validationError.alreadyTaken' }
          throw error
        }
      })
  })
}
