import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protege rutas según autenticación y rol.
 * Props:
 *   requiredRole?: 'pescador' | 'comprador'  – si se omite, solo requiere estar logueado
 *   children
 */
export function ProtectedRoute({ requiredRole, children }) {
  const { auth, isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (requiredRole && auth.rol !== requiredRole) {
    // Redirigir al dashboard correcto según rol real
    const fallback =
      auth.rol === 'pescador' ? '/pescador/dashboard' : '/comprador/marketplace';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
