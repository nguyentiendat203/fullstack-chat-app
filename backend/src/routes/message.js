import express from 'express'
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/messageController.js'
import { protectRoute } from '../middleware/protectRoute.js'
const router = express.Router()

// Mock message route
router.get('/users', protectRoute, getUsersForSidebar)

router.get('/:id', protectRoute, getMessages)

router.post('/send/:id', protectRoute, sendMessage)

export default router
