import { Router } from 'express'
import { userIsAdmin } from '../services/maecenates'
import * as posts from '../controllers/post.controller'
const router = new Router()

function verifyMaecenateAdmin (req, res, next) {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { post: { maecenate } } = req.body

  return userIsAdmin(knex, maecenate, userId).then(result => {
    if (result !== false) {
      next()
    } else {
      const errors = { user: 'error.notOwnerOfMaecenate' }
      res.status(401).json({ errors })
    }
  }).catch(next)
}

router.post('/create', verifyMaecenateAdmin, posts.createPost)
router.get('/:postId', posts.getPost)
router.put('/:postId/edit', verifyMaecenateAdmin, posts.editPost)

export default router
