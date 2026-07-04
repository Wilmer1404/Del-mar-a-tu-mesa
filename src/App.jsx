import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PescadorDashboard from './pages/pescador/Dashboard'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pescador/dashboard" element={<PescadorDashboard />} />
        {/* Rutas futuras del pescador */}
        <Route path="/pescador/*" element={<PescadorDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
