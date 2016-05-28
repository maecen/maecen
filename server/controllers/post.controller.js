import { normalizeResponse } from '../util/ctrlHelpers'
import { knex } from '../database'
import Post from '../models/post'

// verify that the user owns the maecenate
export function createPost (req, res, next) {
  const { userId } = req.user
  const { post: data } = req.body

  let post = new Post(data)
  post.generateId()
  post.set('author', userId)

  post.save(null, { method: 'insert' }).then((post) => {
    return res.json(normalizeResponse({ posts: post }))
  }).catch(next)
}

export function getMaecenatePosts (req, res, next) {
  const { slug } = req.params

  const maecenateQuery = knex('maecenates').where('slug', slug).select('id')
  knex('posts')
    .where('maecenate', 'in', maecenateQuery)
    .orderBy('created_at', 'desc')
    .then((posts) => {
      res.json(normalizeResponse({ posts }))
    })
}
