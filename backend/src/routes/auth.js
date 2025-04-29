import express from 'express'
const router = express.Router()

// Mock authentication route
router.post('/login', (req, res) => {
  const { username, password } = req.body
  // Mock authentication logic
  if (username === 'user' && password === 'password') {
    res.status(200).json({ message: 'Login successful', token: 'mock-token' })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

router.post('/register', (req, res) => {
  const { username, password } = req.body
  // Mock registration logic
  res.status(201).json({ message: 'User registered successfully' })
})

export default router
