import express from 'express'
import connectDB from './config/db.js'
import userRouters from './routes/user.js'
import messageRouters from './routes/message.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { app, io, server } from './config/socket.js'

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)
connectDB()

// Setup routes
app.use('/messages', messageRouters)
app.use('/user', userRouters)

// Start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
