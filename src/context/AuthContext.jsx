import { createContext, useContext, useState } from 'react';

/**
 * AuthContext – Modo simulado (mock).
 * No requiere backend. Usa localStorage para persistir la sesión.
 *
 * roles:
 *   'pescador'  → acceso completo (vendedor + comprador)
 *   'comprador' → solo Marketplace, Mis Compras, Mapa, Configuración
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

  /**
   * login(email, password)
   * Detecta el rol por el email (demo):
   *   - contiene "pescador" o "capitan" → rol pescador
   *   - cualquier otro → rol comprador
   */
  const login = async (email, password) => {
    // Simular latencia de red
    await new Promise(r => setTimeout(r, 700));

    if (!email || !password) {
      throw new Error('Ingresa tu correo y contraseña.');
    }

    const rol = (email.includes('pescador') || email.includes('capitan'))
      ? 'pescador'
      : 'comprador';

    const session = {
      id:     crypto.randomUUID(),
      nombre: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      rol,
      caleta: '',
      token:  'mock-token-' + Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAuth(session);
    return session;
  };

  /**
   * register(data)
   * data: { nombre, email, password, telefono, rol }
   */
  const register = async (data) => {
    await new Promise(r => setTimeout(r, 800));

    if (!data.email || !data.password) {
      throw new Error('Faltan datos obligatorios.');
    }

    const session = {
      id:     crypto.randomUUID(),
      nombre: data.nombre || data.email.split('@')[0],
      email:  data.email,
      rol:    data.rol ?? 'comprador',
      caleta: data.caleta ?? '',
      token:  'mock-token-' + Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAuth(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  /** Actualizar perfil localmente (sin API) */
  const updateProfile = async (data) => {
    await new Promise(r => setTimeout(r, 400));
    const updated = { ...auth, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setAuth(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout, updateProfile, isLoggedIn: !!auth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
