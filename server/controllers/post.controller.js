import { normalizeResponse } from '../util/ctrlHelpers'
import { knex } from '../database'
import Post from '../models/Post'
import PostMedia from '../models/PostMedia'

// verify that the user owns the maecenate
export function createPost (req, res, next) {
  const { userId } = req.user
  const { post: data } = req.body
  const media = data.media

  let post = new Post(data)
  post.generateId()
  post.set('author', userId)
  let postMedia = []

  return post.validate().then(() => {
    post.unset('media')
    if (media) {
      return PostMedia.upload(media, { post: post.id }).then(media => {
        postMedia.push(media)
      })
    }
  }).then(() => {
    // We're going to force (not validate) as we've just validated
    return post.save(null, { method: 'insert', force: true })
  }).then((post) => {
    post = post.toJSON()
    post.media = postMedia.map(media => media.id)
    return res.json(normalizeResponse({ posts: post, postMedia }, 'posts'))
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
