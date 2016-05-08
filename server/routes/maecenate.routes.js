import { Router } from 'express'
import * as MaecenateController from '../controllers/maecenate.controller'
const router = new Router()

// Get Maecenate by slug
router.get('/getMaecenate/:slug', MaecenateController.getMaecenate)

// Get all Maecenates
router.get('/getMaecenates', MaecenateController.getMaecenates)

// Create Maecenate
router.post('/createMaecenate', MaecenateController.createMaecenate)

export default router

