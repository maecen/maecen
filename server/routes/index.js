import { Router } from 'express'
import initialRender from '../initialRender'
import UserRoutes from '../routes/user.routes'
import MaecenateRoutes from '../routes/maecenate.routes'
import PostRoutes from '../routes/post.routes'
import FileRoutes from '../routes/file.routes'
import TransactionRoutes from '../routes/transaction.routes'
import SubscriptionRoutes from '../routes/subscription.routes'
import * as errors from '../routes/errors'

import { authWithAccessToken } from '../controllers/user.controller'

export default function configRoutes (app) {
  const router = Router()

  router.use('/api/users', UserRoutes)
  router.use('/api/maecenates', MaecenateRoutes)
  router.use('/api/posts', PostRoutes)
  router.use('/api/files', FileRoutes)
  router.use('/api/transactions', TransactionRoutes)
  router.use('/api/subscriptions', SubscriptionRoutes)

  router.get('/authToken', authWithAccessToken)

  router.use('/', initialRender)
  router.use(errors.catchError)

  app.use(router)
}
