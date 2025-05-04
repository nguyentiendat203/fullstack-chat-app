import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
const BASE_URL = 'http://localhost:3000'

const useAuthStore = create((set, get) => ({
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  authUser: null,
  onlineUsers: [],
  socket: null,

  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/user/check')
      set({ authUser: response })
      get().connectSocket()
    } catch (error) {
      console.error('Error in checkAuth:', error)
    }
  },

  signup: async (user) => {
    set({ isSigningUp: true })
    try {
      console.log('user in signup:', user)
      const response = await axiosInstance.post('/user/register', user)
      set({ authUser: response })
      get().connectSocket()
      toast.success('Account created successfully')

      //
    } catch (error) {
      console.error('Error in signup:', error)
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (user) => {
    set({ isLoggingIn: true })
    try {
      const response = await axiosInstance.post('/user/login', user)
      set({ authUser: response })
      get().connectSocket()
      toast.success('Logged in successfully')
    } catch (error) {
      console.error('Error in login:', error)
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/user/logout')
      set({ authUser: null })
      get().disconnectSocket()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Error in logout:', error)
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put('/user/update-profile', data)
      set({ authUser: res.data })
      toast.success('Profile updated successfully')
    } catch (error) {
      console.log('error in update profile:', error)
      toast.error(error.response.data.message)
    } finally {
      set({ isUpdatingProfile: false })
    }
  },

  connectSocket: () => {
    const { authUser } = get()
    console.log(get().socket)

    if (!authUser || get().socket?.connected) return

    const socket = io(BASE_URL)

    socket.connect()
    set({ socket })

    console.log('Socket:', socket)
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnected()
  }
}))

export default useAuthStore
