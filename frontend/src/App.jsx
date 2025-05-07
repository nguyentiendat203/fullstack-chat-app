import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
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

function ProtectedRoute() {
  const { authUser } = useAuthStore()
  if (!authUser) return <Navigate to='/login' />
  return <Outlet />
}

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
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Route>
        <Route path='/settings' element={<SettingPage />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
