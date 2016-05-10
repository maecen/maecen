import { Router } from 'express'
import * as UserController from '../controllers/user.controller'
const router = new Router()

// Create a user
router.post('/createUser', UserController.createUser)

// Authenticate user credentials
router.post('/authUser', UserController.authUser)

// Clear the user authentication
router.post('/clearAuth', UserController.clearAuth)

// update the authenticated user
router.post('/updateAuthUser', UserController.updateAuthUser)

// Get the authenticated user
router.get('/getAuthUser', UserController.getAuthUser)

// Set user language
router.put('/setUserLanguage', UserController.setUserLanguage)

export default router
