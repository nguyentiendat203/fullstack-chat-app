import User from '../models/User.js'

export const registerUser = async (req, res) => {
  const { username, password } = req.body
  try {
    const newUser = new User({ username, password })
    await newUser.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' })
  }
}

export const loginUser = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (user && user.password === password) {
      res.status(200).json({ message: 'Login successful', token: 'mock-token' })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' })
  }
}
