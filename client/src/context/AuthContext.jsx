import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    if (!token) {
      setChecking(false);
      return;
    }
    api
      .get('/auth/me')
      .then((r) => setAdmin(r.data.data))
      .catch(() => localStorage.removeItem('ss_token'))
      .finally(() => setChecking(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('ss_token', data.token);
    setAdmin(data.data);
    return data.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ss_token');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, setAdmin, login, logout, checking, isAuthed: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
