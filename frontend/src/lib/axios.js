import axios from 'axios'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'

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
    // 1. Check nếu ở BE trả về 401 Unauthorized
    if (error.status === 401) {
      useAuthStore.getState().logout()
      location.href('/login')
    }

    // 2. Check nếu ở BE trả về 410 Gone, nghĩa là access token hết hạn thì gọi API refresh để làm mới accessToken
    // Đầu tiên lấy đươc request của API đang bị lỗi bằng error.config
    const originalRequest = error.config
    if (error.status === 410 && !originalRequest._retry) {
      // set _retry = true để API refreshToken chỉ gọi 1 lần tại 1 thời điểm
      originalRequest._retry = true

      return axiosInstance
        .post('/user/api/refresh')
        .then((res) => {
          // Sau khi gọi refresh api thì accessToken cug dc update lại ở req.cookies
          // Return lại axiosInstance và kết hợp với originalRequest để gọi lại API ban đầu bị lỗi access token expired
          return axiosInstance(originalRequest)
        })
        .catch((err) => {
          // Nếu như refreshToken hết hạn hoặc bị lỗi thì logout luôn
          useAuthStore.getState().logout()
          location.href('/login')
          return Promise.reject(err)
        })
    }

    if (error.response.data?.status !== 410) {
      toast.error(error.response.data?.message || error?.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
