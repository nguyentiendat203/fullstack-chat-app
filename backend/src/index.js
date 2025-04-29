import express from 'express'
import http from 'http'
import connectDB from './config/db.js'
import setupSocket from './config/socket.js'
import authRouters from './routes/auth.js'
import messageRouters from './routes/message.js'

const app = express()
const server = http.createServer(app)

// Middleware
app.use(express.json())
// Connect to MongoDB
connectDB()

// Setup Socket.IO
setupSocket(server)

// Setup routes
app.use('/messages', messageRouters)
app.use('/auth', authRouters)

// Start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
