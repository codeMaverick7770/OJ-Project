// src/routes/AppRoutes.js
import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import Login from '../components/Login'
import Register from '../pages/Register'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}
