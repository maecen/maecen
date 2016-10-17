import { normalizeResponse } from '../util/ctrlHelpers'
import * as service from '../services/posts'

export function getPost (req, res, next) {
  const { postId } = req.params
  return service.fetchPost(postId).then(post => {
    return res.json(normalizeResponse({ posts: post }))
  }).catch(next)
}

// verify that the user owns the maecenate
export function createPost (req, res, next) {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { post: data } = req.body

  service.createPost(knex, data, userId)
    .then((postId) => {
      return service.fetchPost(postId)
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

