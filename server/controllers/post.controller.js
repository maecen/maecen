import { normalizeResponse } from '../util/ctrlHelpers'
import { knex } from '../database'
import Post from '../models/Post'

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
    return knex('media').where('obj_id', post.id).andWhere('obj_type', 'post')
  }).then((media) => {
    post = post.toJSON()
    post.media = media.map(media => media.id)
    return res.json(normalizeResponse({ posts: post, media }, 'posts'))
  }).catch(next)
}

export function getMaecenatePosts (req, res, next) {
  const { slug } = req.params
  let posts = null

  const maecenateQuery = knex('maecenates').where('slug', slug).select('id')
  knex('posts')
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
        media: media.filter(m => m.obj_id === post.id).map(m => m.id)
      }))

      res.json(normalizeResponse({ posts, media }, 'posts'))
    })
}
