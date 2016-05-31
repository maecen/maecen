import multiparty from 'multiparty'
import { normalizeResponse } from '../util/ctrlHelpers'
import { knex } from '../database'
import Post from '../models/Post'
import PostMedia from '../models/PostMedia'

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
          return trx('post_media')
            .where('id', 'in', mediaIds)
            .andWhere('post', null)
            .update({
              post: post.get('id')
            })
        }
      })
    })
  }).then(() => {
    return knex('post_media').where('post', post.id)
  }).then((postMedia) => {
    post = post.toJSON()
    post.media = postMedia.map(media => media.id)
    return res.json(normalizeResponse({ posts: post, postMedia }, 'posts'))
  }).catch(next)
}

export function uploadPostMedia (req, res, next) {
  return new Promise((resolve, reject) => {
    let postMedia = []
    const form = new multiparty.Form({ autoFields: true })
    form.on('part', (part) => {
      const type = part.headers['content-type']
      postMedia.push(PostMedia.uploadStream(part, { type }))
    })
    form.on('error', reject)
    form.on('close', () => {
      Promise.all(postMedia).then(resolve).catch(reject)
    })
    form.parse(req)
  }).then((postMedia) => {
    return res.json(normalizeResponse({ postMedia }))
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
      return knex('post_media').where('post', 'in', postIds)
    }).then(media => {
      posts = posts.map(post => ({
        ...post,
        media: media.filter(m => m.post === post.id).map(m => m.id)
      }))

      res.json(normalizeResponse({ posts, postMedia: media }, 'posts'))
    })
}
