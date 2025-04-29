import express from 'express'
const router = express.Router()

// Mock message route
router.get('/', (req, res) => {
  res.status(200).json({ messages: ['Hello', 'Hi', 'How are you?'] })
})

router.post('/', (req, res) => {
  const { message } = req.body
  // Mock message saving logic
  res.status(201).json({ message: 'Message sent successfully', data: message })
})

export default router
