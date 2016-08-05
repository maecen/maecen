import { Router } from 'express'
import * as transactions from '../controllers/transaction.controller'

const router = new Router()

router.get('/payment-callback', transactions.paymentCallback)

export default router
