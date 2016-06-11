import { Router } from 'express'
import * as PostController from '../controllers/post.controller'
import Maecenate from '../models/Maecenate'
const router = new Router()

function verifyMaecenateAdmin (req, res, next) {
  const { userId } = req.user
  const { post: { maecenate } } = req.body
  return Maecenate.isUserAdmin(maecenate, userId).then(result => {
    if (result === true) {
      next()
    } else {
      const errors = { user: 'error.notOwnerOfMaecenate' }
      res.status(401).json({ errors })
    }
  }).catch(next)
}

// Create a post
router.post('/createPost', verifyMaecenateAdmin, PostController.createPost)

// Get all posts by maecenate slug
router.get('/getMaecenatePosts/:slug', PostController.getMaecenatePosts)

export default router

