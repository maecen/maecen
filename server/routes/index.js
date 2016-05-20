import { Router } from 'express'
import UserRoutes from '../routes/user.routes'
import MaecenateRoutes from '../routes/maecenate.routes'
import { formatResponseError } from '../util/ctrlHelpers'

const router = new Router()

router.use(UserRoutes)
router.use(MaecenateRoutes)

router.use((err, req, res, next) => {
  console.log(err.stack)
  const errors = formatResponseError(err)
  res.status(500).json({ errors })
})

export default router
