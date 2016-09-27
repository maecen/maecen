import { Router } from 'express'
import * as media from '../controllers/media.controller'
const router = new Router()

// Upload media
router.post('/upload', media.uploadMedia)

export default router
