import { Router } from 'express'
import initialRender from '../index'
import UserRoutes from '../routes/user.routes'
import MaecenateRoutes from '../routes/maecenate.routes'
import PostRoutes from '../routes/post.routes'
import MediaRoutes from '../routes/media.routes'
import TransactionRoutes from '../routes/transaction.routes'
import * as errors from '../routes/errors'

import { authWithAccessToken } from '../controllers/user.controller'

export default function configRoutes (app) {
  const router = Router()

  router.use('/api', UserRoutes)
  router.use('/api', MaecenateRoutes)
  router.use('/api', PostRoutes)
  router.use('/api', MediaRoutes)
  router.use('/api/transactions', TransactionRoutes)

  router.get('/authToken', authWithAccessToken)

  router.use('/', initialRender)
  router.use(errors.catchError)

  app.use(router)
}
