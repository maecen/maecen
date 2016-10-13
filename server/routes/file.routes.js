import { Router } from 'express'
import * as files from '../controllers/file.controller'
const router = new Router()

// Upload media
router.post('/upload', files.uploadFile)
router.post('/upload-media', files.uploadMedia)

export default router
