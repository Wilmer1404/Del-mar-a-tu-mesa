import { createContext, useContext, useState } from 'react';

/**
 * AuthContext – Gestión global de sesión y rol de usuario.
 *
 * roles:
 *   'pescador'  → acceso completo (vendedor + comprador)
 *   'comprador' → solo Marketplace, Mis Compras, Mapa de Caletas, Configuración
 */
const AuthContext = createContext(null);

const STORAGE_KEY = 'dmtm_auth';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadFromStorage());

  const login = (userData) => {
    const session = {
      id:     userData.id    ?? crypto.randomUUID(),
      nombre: userData.nombre ?? userData.name ?? 'Usuario',
      email:  userData.email,
      rol:    userData.rol ?? 'comprador',   // 'pescador' | 'comprador'
      caleta: userData.caleta ?? '',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAuth(session);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isLoggedIn: !!auth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
