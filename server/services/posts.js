import Joi from 'joi'
import Immutable from 'seamless-immutable'
import { knex } from '../database'
import { joiValidation } from '../util/ctrlHelpers'
import { deleteMedia } from './media'

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

// Database Calls
// ==============
export function fetchPost (id) {
  return Promise.all([
    knex('posts').where({ id }).limit(1),
    knex('media').where('obj_id', id).andWhere('obj_type', 'post').select('id', 'type', 'url')
  ]).then((args) => {
    const [[post], media] = args
    return {
      ...post,
      media
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
          return trx('media')
            .where('id', 'in', mediaIds)
            .andWhere('obj_id', null)
            .update({ obj_id: id, obj_type: 'post' })
        }
      }).then(() => {
        if (mediaIds.length > 0) {
          return trx('media').whereNotIn('id', mediaIds)
            .andWhere('obj_id', id)
            .select('id')
            .then(media => media.map(o => o.id))
            .then(deleteMediaIds => {
              return deleteMedia(deleteMediaIds, trx)
            })
        }
      })
    })
  })
}
