import axios from 'axios'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  // Sẽ cho phép axios tự động đính kèm cookies accessToken và refreshToken mỗi lần gửi req đến BE theo cơ chết HttpOnly Cookie
  withCredentials: true
})

axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // For example, you can add an authorization token to the headers

    return config
  },
  (error) => {
    // Do something with request error
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response.data
  },
  (error) => {
    // Do something with response error
    console.error('Response error:', error)

    if (error.response.data?.status !== 410) {
      toast.error(error.response.data?.message || error?.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
