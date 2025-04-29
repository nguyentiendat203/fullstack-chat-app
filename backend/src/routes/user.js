import express from 'express'
import { registerUser, loginUser, logout, checkAuth, updateProfile } from '../controllers/userController.js'
import { protectRoute } from '../middleware/protectRoute.js'
const router = express.Router()

// Mock authentication route
router.post('/login', loginUser)
router.post('/register', registerUser)
router.post('/logout', logout)

router.put('/update-profile', protectRoute, updateProfile)
router.get('/check', protectRoute, checkAuth)

export default router
