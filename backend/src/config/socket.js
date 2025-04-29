import { Server } from 'socket.io'

const setupSocket = (server) => {
  const io = new Server(server)

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('sendMessage', (message) => {
      io.emit('receiveMessage', message)
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })
  })

  return io
}

export default setupSocket
