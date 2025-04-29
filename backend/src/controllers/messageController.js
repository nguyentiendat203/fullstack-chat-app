import Message from '../models/Message.js'

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'username')
    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' })
  }
}

export const createMessage = async (req, res) => {
  const { sender, content } = req.body
  try {
    const newMessage = new Message({ sender, content })
    await newMessage.save()
    res.status(201).json(newMessage)
  } catch (error) {
    res.status(500).json({ error: 'Error creating message' })
  }
}
