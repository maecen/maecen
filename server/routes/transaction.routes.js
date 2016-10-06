import { Router } from 'express'
import * as transactions from '../controllers/transaction.controller'

const router = new Router()

router.get('/payment-callback', transactions.paymentCallback)
router.get('/csv-extract/:code', transactions.csvExtract)

export default router
