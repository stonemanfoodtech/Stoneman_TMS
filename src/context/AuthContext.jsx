import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api, { onUnauthorized, tokenStore } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  const setSession = useCallback(({ token, user: nextUser }) => {
    if (token) tokenStore.set(token);
    setUser(nextUser);
  }, []);

  const logout = useCallback((message) => {
    tokenStore.clear();
    setUser(null);
    if (message) toast(message, { icon: '🔒' });
  }, []);

  useEffect(() => {
    onUnauthorized((message) => logout(message || 'Your session has ended. Please sign in again.'));
  }, [logout]);

  useEffect(() => {
    if (!tokenStore.get()) {
      setBooting(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => tokenStore.clear())
      .finally(() => setBooting(false));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post('/auth/login', { email, password });
      setSession(data);
      return data.user;
    },
    [setSession]
  );

  const refreshUser = useCallback(async () => {
    if (!tokenStore.get()) return null;
    const { data } = await api.get('/auth/me');
    // Ignore the reply if the user signed out while it was in flight.
    if (tokenStore.get()) setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({ user, booting, isAdmin: user?.role === 'admin', login, logout, setSession, refreshUser }),
    [user, booting, login, logout, setSession, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export const homePathFor = (user) => (user?.role === 'admin' ? '/admin/reports' : '/dashboard');
