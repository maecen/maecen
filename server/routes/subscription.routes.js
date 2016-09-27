import { Router } from 'express'
import * as subscriptions from '../controllers/subscription.controller'

const router = new Router()

router.put('/subscriptions/:id/cancel', subscriptions.cancelSubscription)
router.put('/subscriptions/:id/update', subscriptions.updateSubscription)

export default router
