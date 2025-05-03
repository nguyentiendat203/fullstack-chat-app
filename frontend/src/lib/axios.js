import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
})

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response.data
  },
  (error) => {
    // Do something with response error
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

export default axiosInstance
