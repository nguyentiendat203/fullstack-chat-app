import { create } from 'zustand'
import axiosInstance from '../lib/axios'

const useChatStore = create((set, get) => ({
  isUsersLoading: false,
  isMessagesLoading: false,

  messages: [],
  users: [],
  setUsers: (users) => set({ users }),
  selectedUser: null,
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const users = await axiosInstance.get('/messages/users')
      set({ users })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const messages = await axiosInstance.get(`/messages/${userId}`)
      set({ messages })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isMessagesLoading: false })
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get()
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
      set({ messages: [...messages, res] })
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
}))

export default useChatStore
