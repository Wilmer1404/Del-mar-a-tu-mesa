import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PescadorDashboard from './pages/pescador/Dashboard'
import RegistrarCaptura from './pages/pescador/RegistrarCaptura'
import MisCompras from './pages/pescador/MisCompras'
import MapaCaletas from './pages/pescador/MapaCaletas'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pescador/dashboard" element={<PescadorDashboard />} />
        <Route path="/pescador/captura" element={<RegistrarCaptura />} />
        <Route path="/pescador/compras" element={<MisCompras />} />
        <Route path="/pescador/mapa" element={<MapaCaletas />} />
        {/* Rutas futuras del pescador */}
        <Route path="/pescador/*" element={<PescadorDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
