import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
const app = express()

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

const userSocketMap = {} // {userId: socketId}

export const getSocketId = (userId) => {
  return userSocketMap[userId]
}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId
  userId ? (userSocketMap[userId] = socket.id) : null

  // Gửi danh sách người dùng online cho tất cả client
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

export { io, app, server }
