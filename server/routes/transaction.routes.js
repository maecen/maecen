import { Router } from 'express'
import * as transactions from '../controllers/transaction.controller'

const router = new Router()

router.get('/payment-callback', transactions.paymentCallback)
router.get('/cron-refresh-subscriptions', transactions.cronRefreshSubscriptions)

export default router
