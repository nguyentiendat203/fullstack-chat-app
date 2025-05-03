import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { Signup } from './pages/Signup'
import { ProfilePage } from './pages/ProfilePage'
import { SettingPage } from './pages/SettingPage'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/useAuthStore'
import { useEffect } from 'react'
import Navbar from './components/Navbar'

function App() {
  const { authUser, checkAuth } = useAuthStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to='/' />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/setting' element={<SettingPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
