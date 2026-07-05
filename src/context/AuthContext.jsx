import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

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

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const body = res.data;
    const user = body.user;
    const session = {
      id:      user.id,
      nombre:  user.nombre,
      email:   user.email,
      rol:     user.rol,
      caleta:  user.caleta_principal || '',
      token:   body.token,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAuth(session);
    return session;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const body = res.data;
    const user = body.user;
    const session = {
      id:      user.id,
      nombre:  user.nombre,
      email:   user.email,
      rol:     user.rol,
      caleta:  user.caleta_principal || '',
      token:   body.token,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAuth(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    const updated = res.data;
    const session = {
      ...auth,
      nombre: updated.nombre ?? auth.nombre,
      email:  updated.email ?? auth.email,
      caleta: updated.caleta_principal ?? auth.caleta,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAuth(session);
    return session;
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
