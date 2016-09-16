import { Router } from 'express'
import { verifyAuth, verifyMaecenateAdmin } from '../util/permissions'
import * as maecenates from '../controllers/maecenate.controller'
import * as transactions from '../controllers/transaction.controller'

const router = new Router()

// Get Maecenate by slug
router.get('/getMaecenate/:slug', maecenates.getMaecenate)

// Get all Maecenates
router.get('/getMaecenates', maecenates.getMaecenates)

// Get all Maecenates by user
router.get('/getUserMaecenates/:user', maecenates.getUserMaecenates)

// Create Maecenate
router.post('/createMaecenate', verifyAuth, maecenates.createMaecenate)

router.put('/editMaecenate/:slug', verifyMaecenateAdmin,
  maecenates.editMaecenate)

// Get all the maecenates a user supports
router.get('/getSupportedMaecenates/:user', maecenates.getSupportedMaecenates)

router.get('/getMaecenateSupporters/:slug', verifyMaecenateAdmin,
  maecenates.getMaecenateSupporters)

router.post('/maecenates/initiate-payment', transactions.maecenateInitiatePayment)

router.put('/cancelSubscription/:id', maecenates.cancelSubscription)

export default router

