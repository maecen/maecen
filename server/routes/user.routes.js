import { Router } from 'express'
import * as users from '../controllers/user.controller'
const router = new Router()

// Create a user
router.post('/create', users.createUser)
router.post('/auth', users.authUser)
router.post('/clear-auth', users.clearAuth)
router.post('/forgot-password', users.forgotPassword)

router.get('/me', users.getAuthUser)

const userRouter = new Router({ mergeParams: true })
userRouter.put('/edit', users.updateAuthUser)
userRouter.put('/set-language', users.setUserLanguage)
userRouter.get('/has-permission/:area', users.hasPermission)
userRouter.get('/has-permission/:area/:id', users.hasPermission)
userRouter.get('/admin-maecenates', users.getAdminMaecenates)
userRouter.get('/supported-maecenates', users.getSupportedMaecenates)
userRouter.get('/feed', users.getFeed)

router.use('/:userId', userRouter)

export default router
