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

export function getUserFeed (req, res, next) {
  const { userId } = req.user
  service.fetchSupportedMaecenatePosts(userId).then((result) => {
    const { maecenates, posts, supports } = result
    res.json(normalizeResponse({
      maecenates,
      posts,
      supports
    }, 'posts'))
  })
}

export function getMaecenatePosts (req, res, next) {
  const { slug } = req.params
  let posts = null

  const maecenateQuery = knex('maecenates').where('slug', slug).select('id')
  return knex('posts')
    .where('maecenate', 'in', maecenateQuery)
    .orderBy('created_at', 'desc')
    .then((res) => {
      posts = res
      const postIds = posts.map(post => post.id)
      return knex('media').where('obj_id', 'in', postIds)
        .andWhere('obj_type', 'post')
    }).then(media => {
      posts = posts.map(post => ({
        ...post,
        media: media.filter(m => m.obj_id === post.id)
      }))

      res.json(normalizeResponse({ posts }))
    }).catch(next)
}
