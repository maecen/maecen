import { Router } from 'express'
import mapValues from 'lodash/mapValues'
import UserRoutes from '../routes/user.routes'
import MaecenateRoutes from '../routes/maecenate.routes'
import PostRoutes from '../routes/post.routes'
import MediaRoutes from '../routes/media.routes'
import { formatResponseError } from '../util/ctrlHelpers'

const router = new Router()

router.use(UserRoutes)
router.use(MaecenateRoutes)
router.use(PostRoutes)
router.use(MediaRoutes)

router.use((err, req, res, next) => {
  if (err.stack) {
    console.log(err.stack)
  }

  let errors = formatResponseError(err)

  errors = mapValues(errors, (error, key) => {
    if (error.message) {
      return localizeMessage(req.t, error.message, error.options)
    } else {
      return localizeMessage(req.t, error, { context: key })
    }
  })

  res.status(500).json({ errors })
})

function localizeMessage (t, message, options) {
  // Check if it's a token and not a normal text
  if (message.includes(' ') === false && message.includes('.') === true) {
    return t(message, options)
  }

  return message
}

export default router
