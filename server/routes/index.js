import { Router } from 'express'
import UserRoutes from '../routes/user.routes'
import MaecenateRoutes from '../routes/maecenate.routes'

const router = new Router()

router.use(UserRoutes)
router.use(MaecenateRoutes)

export default router
