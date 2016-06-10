import { Router } from 'express'
import { verifyAuth } from '../util/permissions'
import * as MaecenateController from '../controllers/maecenate.controller'
const router = new Router()

// Get Maecenate by slug
router.get('/getMaecenate/:slug', MaecenateController.getMaecenate)

// Get all Maecenates
router.get('/getMaecenates', MaecenateController.getMaecenates)

// Get all Maecenates by user
router.get('/getUserMaecenates/:user', MaecenateController.getUserMaecenates)

// Create Maecenate
router.post('/createMaecenate', verifyAuth, MaecenateController.createMaecenate)

router.post('/supportMaecenate', MaecenateController.supportMaecenate)

export default router

