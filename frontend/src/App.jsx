import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { Signup } from './pages/Signup'
import { ProfilePage } from './pages/ProfilePage'
import { SettingPage } from './pages/SettingPage'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/singup' element={<Signup />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/setting' element={<SettingPage />} />
      </Routes>
    </>
  )
}

export default App
