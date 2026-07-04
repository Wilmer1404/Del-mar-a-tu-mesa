import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PescadorDashboard from './pages/pescador/Dashboard'
import RegistrarCaptura from './pages/pescador/RegistrarCaptura'
import MisCompras from './pages/pescador/MisCompras'
import MapaCaletas from './pages/pescador/MapaCaletas'
import TrazabilidadQR from './pages/pescador/TrazabilidadQR'
import Reportes from './pages/pescador/Reportes'
import Configuracion from './pages/pescador/Configuracion'
import MisOfertas from './pages/pescador/MisOfertas'
import Marketplace from './pages/pescador/Marketplace'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pescador/dashboard"     element={<PescadorDashboard />} />
        <Route path="/pescador/ofertas"        element={<MisOfertas />} />
        <Route path="/pescador/marketplace"    element={<Marketplace />} />
        <Route path="/pescador/captura"        element={<RegistrarCaptura />} />
        <Route path="/pescador/compras"        element={<MisCompras />} />
        <Route path="/pescador/mapa"           element={<MapaCaletas />} />
        <Route path="/pescador/trazabilidad"   element={<TrazabilidadQR />} />
        <Route path="/pescador/reportes"       element={<Reportes />} />
        <Route path="/pescador/configuracion"  element={<Configuracion />} />
        {/* Fallback pescador */}
        <Route path="/pescador/*" element={<PescadorDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
