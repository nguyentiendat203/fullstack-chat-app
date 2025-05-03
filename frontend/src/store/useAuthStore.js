import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import toast from 'react-hot-toast'

const useAuthStore = create((set) => ({
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  authUser: null,

  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/user/check')
      set({ authUser: response })
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
  }
}))

export default useAuthStore
