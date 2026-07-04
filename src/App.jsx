import { Navigate, Route, Routes, BrowserRouter as Router } from 'react-router-dom'

// Auth
import Login    from './pages/auth/Login'
import Register from './pages/auth/Register'

// Guard
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { useAuth }        from './context/AuthContext'

// ── Pescador (rol: pescador) ───────────────────────────────────────────────────
import PescadorDashboard from './pages/pescador/Dashboard'
import MisOfertas        from './pages/pescador/MisOfertas'
import RegistrarCaptura  from './pages/pescador/RegistrarCaptura'
import MisCompras        from './pages/pescador/MisCompras'
import MapaCaletas       from './pages/pescador/MapaCaletas'
import TrazabilidadQR    from './pages/pescador/TrazabilidadQR'
import Reportes          from './pages/pescador/Reportes'
import Configuracion     from './pages/pescador/Configuracion'
import Marketplace       from './pages/pescador/Marketplace'

// ── Comprador (rol: comprador) ────────────────────────────────────────────────
import CompradorMarketplace from './pages/comprador/CompradorMarketplace'
import CompradorCompras     from './pages/comprador/CompradorCompras'
import CompradorMapa        from './pages/comprador/CompradorMapa'
import CompradorConfig      from './pages/comprador/CompradorConfig'

import './index.css'

// Redirige a la raíz correcta según rol
function RootRedirect() {
  const { auth, isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <Navigate to={auth.rol === 'pescador' ? '/pescador/dashboard' : '/comprador/marketplace'} replace />
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ── Públicas ── */}
        <Route path="/"         element={<RootRedirect />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Pescador + Cliente ── */}
        <Route path="/pescador/dashboard"    element={<ProtectedRoute requiredRole="pescador"><PescadorDashboard /></ProtectedRoute>} />
        <Route path="/pescador/ofertas"      element={<ProtectedRoute requiredRole="pescador"><MisOfertas /></ProtectedRoute>} />
        <Route path="/pescador/captura"      element={<ProtectedRoute requiredRole="pescador"><RegistrarCaptura /></ProtectedRoute>} />
        <Route path="/pescador/compras"      element={<ProtectedRoute requiredRole="pescador"><MisCompras /></ProtectedRoute>} />
        <Route path="/pescador/mapa"         element={<ProtectedRoute requiredRole="pescador"><MapaCaletas /></ProtectedRoute>} />
        <Route path="/pescador/trazabilidad" element={<ProtectedRoute requiredRole="pescador"><TrazabilidadQR /></ProtectedRoute>} />
        <Route path="/pescador/reportes"     element={<ProtectedRoute requiredRole="pescador"><Reportes /></ProtectedRoute>} />
        <Route path="/pescador/configuracion"element={<ProtectedRoute requiredRole="pescador"><Configuracion /></ProtectedRoute>} />
        <Route path="/pescador/marketplace"  element={<ProtectedRoute requiredRole="pescador"><Marketplace /></ProtectedRoute>} />
        <Route path="/pescador/*"            element={<ProtectedRoute requiredRole="pescador"><PescadorDashboard /></ProtectedRoute>} />

        {/* ── Solo Comprador ── */}
        <Route path="/comprador/marketplace"   element={<ProtectedRoute requiredRole="comprador"><CompradorMarketplace /></ProtectedRoute>} />
        <Route path="/comprador/compras"       element={<ProtectedRoute requiredRole="comprador"><CompradorCompras /></ProtectedRoute>} />
        <Route path="/comprador/mapa"          element={<ProtectedRoute requiredRole="comprador"><CompradorMapa /></ProtectedRoute>} />
        <Route path="/comprador/configuracion" element={<ProtectedRoute requiredRole="comprador"><CompradorConfig /></ProtectedRoute>} />
        <Route path="/comprador/*"             element={<ProtectedRoute requiredRole="comprador"><CompradorMarketplace /></ProtectedRoute>} />

        {/* ── Fallback global ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
