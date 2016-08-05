import Joi from 'joi'
import uuid from 'uuid'
import Immutable from 'seamless-immutable'
import mapKeys from 'lodash/mapKeys'
import { slugify } from 'strman'
import { joiValidation } from '../util/ctrlHelpers'
import { knex } from '../database'
import { claimMedia, deleteUnusedMedia } from './media'

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
      getMaecenateUserSupports(maecenate.id, userId)
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
  let supports = null
  return knex('supporters').where('user', userId).then(result => {
    supports = result
    const maecenateIds = supports.map(support => support.maecenate)
    return fetchMaecenates(function () {
      this.where('id', 'in', maecenateIds)
    })
  }).then((maecenates) => ({
    maecenates,
    supports
  }))
}

export function userHasContentAccess (maecenateId, userId) {
  return userIsAdmin()
}

export function userIsAdmin (maecenateId, userId) {
  return knex('maecenates').where({ id: maecenateId, creator: userId })
  .count('1')
  .then(res => {
    console.log(res)
  })
}

// Create a new support between the user and the maecenate
// If a support between them already exists, we just alter it
// and update the amount
export function supportMaecenate (maecenateId, userId, amount) {
  return knex('supporters').where({ maecenate: maecenateId, user: userId }).limit(0)
  .then(([currentSupport]) => {
    if (currentSupport) {
      const support = {
        ...currentSupport,
        amount
      }
      return knex('supporters').where({ id: currentSupport.id })
        .update(support).then(() => support)
    } else {
      const support = {
        id: uuid.v1(),
        user: userId,
        maecenate: maecenateId,
        amount
      }
      return knex('supporters').insert(support).then(() => support)
    }
  })
}

// Helper methods
// ==============
function getMaecenateUserSupports (maecenateId, userId) {
  if (userId) {
    return knex('supporters')
      .where('user', userId)
      .andWhere('maecenate', maecenateId)
  }
}

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
