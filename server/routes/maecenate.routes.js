import { Router } from 'express'
import { verifyAuth, verifyMaecenateAdmin } from '../util/permissions'
import * as maecenates from '../controllers/maecenate.controller'
import * as transactions from '../controllers/transaction.controller'

const router = new Router()

// Get Maecenate by slug
router.get('/', maecenates.getMaecenates)
router.get('/overview', maecenates.getMaecenatesOverview)
router.post('/create', verifyAuth, maecenates.createMaecenate)
router.post('/initiate-payment', transactions.maecenateInitiatePayment)
router.get('/:slug', maecenates.getMaecenate)
router.get('/:slug/feed', maecenates.getFeed)

// Admin Routes
const adminRouter = new Router({ mergeParams: true })
adminRouter.use('/', verifyMaecenateAdmin)
adminRouter.put('/edit', maecenates.editMaecenate)
adminRouter.put('/deactivate', maecenates.deactivateMaecenate)
adminRouter.get('/details', maecenates.getAdminDetails)
adminRouter.get('/supporters', maecenates.getMaecenateSupporters)
adminRouter.post('/email-supporters', maecenates.sendEmailToSupporters)

router.use('/:slug/admin', adminRouter)

export default router

