import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { Signup } from './pages/SignUp'
import { ProfilePage } from './pages/ProfilePage'
import { SettingPage } from './pages/SettingPage'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/useAuthStore'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import useThemeStore from './store/useThemeStore'

function App() {
  const { authUser, checkAuth } = useAuthStore()
  const { theme } = useThemeStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to='/' />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/' />} />
        <Route path='/settings' element={<SettingPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
