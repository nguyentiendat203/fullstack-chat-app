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

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id)
  })
})

export { io, app, server }
