// Imports
import Joi from 'joi'
import uuid from 'node-uuid'
import Immutable from 'seamless-immutable'

import { knex } from '../database'
import { joiValidation } from '../util/ctrlHelpers'
import { postStatus } from '../../shared/config'

// Services
import { claimFiles, deleteUnusedFiles, populatePostsWithFiles } from './files'
import { fetchMaecenates } from './maecenates'
import { fetchActiveUserSubPeriods } from './subscriptions'

// Schema validation of the data
// =============================
const schema = Joi.object({
  id: Joi.string().guid(),
  title: Joi.string().allow(null, ''),
  maecenate: Joi.string().guid().required(),
  author: Joi.string().guid().required(),
  author_alias: Joi.string().required(),
  content: Joi.string().allow(null, ''),
  media: [Joi.any().allow(null, '')],
  status: Joi.string().only(Object.keys(postStatus)).required()
}).or('media', 'content')

// Database Calls
// ==============
export function fetchPost (id) {
  return knex('posts').where({ id }).limit(1)
  .then(posts => populatePostsWithFiles(knex, posts))
  .then(([post]) => {
    return post || null
  })
}

export function createPost (knex, data, userId) {
  const post = Immutable({
    ...data,
    author: userId,
    id: uuid.v1()
  })

  return joiValidation(post, schema, true)
  .then(() => {
    const fileIds = getFilesFromData(data)

    return knex.transaction(trx => {
      return trx('posts').insert(post.without('media', 'file'))
      .then(() => {
        if (fileIds) {
          return claimFiles(trx, fileIds, 'post', post.id)
        }
      })
      .then(() => post.id)
    })
  })
}

export function updatePost (id, data) {
  data = Immutable(data)
  return joiValidation(data, schema, true)
  .then(() => {
    const fileIds = getFilesFromData(data)
    data = data.without('media', 'file', 'id')

    return knex.transaction(trx => {
      return trx('posts').where({ id }).update(data)
      .then(() => {
        if (fileIds) {
          return claimFiles(trx, fileIds, 'post', id)
        }
      })
      .then(() => {
        if (fileIds.length > 0) {
          return deleteUnusedFiles(trx, 'post', id, fileIds)
        }
      })
    })
  })
}

export function fetchSupportedMaecenatePosts (userId) {
  return fetchActiveUserSubPeriods(knex, userId).then((supports) => {
    const maecenateIds = supports.map(o => o.maecenate)

    return Promise.all([
      fetchMaecenates(function () {
        this.where('id', 'in', maecenateIds)
      }),
      knex('posts')
      .where('maecenate', 'in', maecenateIds)
      .where('status', postStatus.PUBLISHED)
      .orderBy('created_at', 'desc')
      .limit(10)
      .then(posts => populatePostsWithFiles(knex, posts))
    ])
    .then((result) => {
      const [maecenates, posts] = result
      return {
        maecenates,
        posts,
        supports
      }
    })
  })
}

const getFilesFromData = (data) => {
  const media = data.media || []
  const files = data.file || []
  return [
    ...media.filter(o => typeof o === 'string'),
    ...files.filter(o => typeof o === 'string')
  ]
}
