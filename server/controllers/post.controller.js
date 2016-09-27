import { normalizeResponse } from '../util/ctrlHelpers'
import * as service from '../services/posts'
import { knex } from '../database'
import Post from '../models/Post'

export function getPost (req, res, next) {
  const { postId } = req.params
  return service.fetchPost(postId).then(post => {
    return res.json(normalizeResponse({ posts: post }))
  }).catch(next)
}

// verify that the user owns the maecenate
export function createPost (req, res, next) {
  const { userId } = req.user
  const { post: data } = req.body
  const mediaIds = data.media

  let post = new Post(data)
  post.generateId()
  post.set('author', userId)

  post.validate().then(() => {
    post.unset('media')
    return knex.transaction(trx => {
      return trx('posts').insert(post.toJSON()).then(() => {
        if (mediaIds) {
          return trx('media')
            .where('id', 'in', mediaIds)
            .andWhere('obj_id', null)
            .update({
              obj_id: post.get('id'),
              obj_type: 'post'
            })
        }
      })
    })
  }).then(() => {
    return service.fetchPost(post.id)
  }).then(result => {
    return res.json(normalizeResponse({ posts: result }))
  }).catch(next)
}

export function editPost (req, res, next) {
  const { post } = req.body
  return service.updatePost(post.id, post).then(() => {
    return service.fetchPost(post.id)
  }).then(post => {
    return res.json(normalizeResponse({ posts: post }))
  }).catch(next)
}

