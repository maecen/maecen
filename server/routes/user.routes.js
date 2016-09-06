import { Router } from 'express'
import * as UserController from '../controllers/user.controller'
const router = new Router()

// Create a user
router.post('/createUser', UserController.createUser)

// Authenticate user credentials
router.post('/authUser', UserController.authUser)

// User forgot password
router.post('/forgotPassword', UserController.forgotPassword)

// Clear the user authentication
router.post('/clearAuth', UserController.clearAuth)

// update the authenticated user
router.post('/updateAuthUser', UserController.updateAuthUser)

// Get the authenticated user
router.get('/getAuthUser', UserController.getAuthUser)

// Set user language
router.put('/setUserLanguage', UserController.setUserLanguage)

// Check if the user has permission to the requested thing
router.get('/hasPermission/:area', UserController.hasPermission)
router.get('/hasPermission/:area/:id', UserController.hasPermission)

export default router
