import { Router } from 'express'
import * as subscriptions from '../controllers/subscription.controller'

const router = new Router()

router.put('/:id/cancel', subscriptions.cancelSubscription)
router.put('/:id/update', subscriptions.updateSubscription)

export default router
