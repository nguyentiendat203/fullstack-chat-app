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

  setAuthUser: (newAuthUser) => set({ authUser: newAuthUser }),

  checkAuth: () => {
    const authUser = localStorage.getItem('authUser')
    if (authUser) {
      set({ authUser: JSON.parse(authUser) })
      get().connectSocket()
    } else {
      set({ authUser: null })
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
    try {
      set({ isLoggingIn: true })
      const response = await axiosInstance.post('/user/login', user)
      set({ authUser: response })
      const { accessToken, refreshToken, ...rest } = response
      localStorage.setItem('authUser', JSON.stringify(rest))
      get().connectSocket()
    } catch (error) {
      console.log(error)
    } finally {
      set({ isLoggingIn: false })
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

    if (!authUser || get().socket?.connected) return

    // Tạo socket kết nối đến server, mỗi người dùng khi đăng nhập sẽ có một socket riêng,
    // socketId sẽ được lưu trong userSocketMap trên server
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    })

    socket.connect()
    set({ socket })

    // Nhận danh sách người dùng online từ server
    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnected()
  }
}))

export default useAuthStore
