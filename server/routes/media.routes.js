import { Router } from 'express'
import * as MediaController from '../controllers/media.controller'
const router = new Router()

// Upload media
router.post('/uploadMedia', MediaController.uploadMedia)

export default router
