import express from 'express'
import mongoose from 'mongoose'
import http from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/auth.js'
import messageRoutes from './routes/message.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Middleware
app.use(express.json())

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Routes
app.use('/auth', authRoutes)
app.use('/message', messageRoutes)

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})

// Start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
