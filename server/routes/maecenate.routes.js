import { Router } from 'express'
import { verifyAuth, verifyMaecenateAdmin } from '../util/permissions'
import * as controllers from '../controllers/maecenate.controller'

const router = new Router()

// Get Maecenate by slug
router.get('/getMaecenate/:slug', controllers.getMaecenate)

// Get all Maecenates
router.get('/getMaecenates', controllers.getMaecenates)

// Get all Maecenates by user
router.get('/getUserMaecenates/:user', controllers.getUserMaecenates)

// Create Maecenate
router.post('/createMaecenate', verifyAuth, controllers.createMaecenate)

router.put('/editMaecenate/:slug', verifyMaecenateAdmin,
  controllers.editMaecenate)

// Support a maecenate (become maecen)
router.post('/supportMaecenate', controllers.supportMaecenate)

// Get all the maecenates a user supports
router.get('/getSupportedMaecenates/:user', controllers.getSupportedMaecenates)

router.get('/getMaecenateSupporters/:slug', verifyMaecenateAdmin,
  controllers.getMaecenateSupporters)

export default router

