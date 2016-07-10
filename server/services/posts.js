import Joi from 'joi'
import Immutable from 'seamless-immutable'
import { knex } from '../database'
import { joiValidation } from '../util/ctrlHelpers'
import { claimMedia, deleteUnusedMedia } from './media'
import { fetchMaecenates } from './maecenates'

// Schema validation of the data
// =============================
const schema = Joi.object({
  id: Joi.string().guid(),
  title: Joi.string(),
  maecenate: Joi.string().guid().required(),
  author: Joi.string().guid().required(),
  author_alias: Joi.string().required(),
  content: Joi.string().allow(null, ''),
  media: [Joi.any().allow(null, '')]
}).or('media', 'content')

// Private methods
// ===============
function populateMedia (posts) {
  const postIds = posts.map(post => post.id)
  return knex('media').where('obj_id', 'in', postIds)
    .andWhere('obj_type', 'post')
    .then(media => {
      return posts.map(post => ({
        ...post,
        media: media.filter(m => m.obj_id === post.id)
      }))
    })
}

// Database Calls
// ==============
export function fetchPost (id) {
  return Promise.all([
    knex('posts').where({ id }).limit(1),
    knex('media').where('obj_id', id).andWhere('obj_type', 'post').select('id', 'type', 'url')
  ]).then((args) => {
    const [[post], media] = args
    if (post) {
      return {
        ...post,
        media
      }
    } else {
      return null
    }
  })
}

export function updatePost (id, data) {
  data = Immutable(data)
  return joiValidation(data, schema, true).then(() => {
    const media = data.media || []
    const mediaIds = media.filter(o => typeof o === 'string')

    data = data.without('media', 'id')

    return knex.transaction(trx => {
      return trx('posts').where({ id }).update(data).then(() => {
        if (mediaIds) {
          return claimMedia(mediaIds, 'post', id, trx)
        }
      }).then(() => {
        if (mediaIds.length > 0) {
          return deleteUnusedMedia('post', id, mediaIds, trx)
        }
      })
    })
  })
}

export function fetchSupportedMaecenatePosts (userId) {
  let supports = null
  return knex('supporters').where('user', userId).then((result) => {
    supports = result
    const maecenateIds = supports.map(o => o.maecenate)
    return Promise.all([
      fetchMaecenates(function () {
        this.where('id', 'in', maecenateIds)
      }),
      knex('posts')
        .where('maecenate', 'in', maecenateIds)
        .orderBy('created_at', 'desc')
        .limit(10)
        .then(populateMedia)
    ])
  }).then((result) => {
    const [maecenates, posts] = result
    return {
      maecenates,
      posts,
      supports
    }
  })
}