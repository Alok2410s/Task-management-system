import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem('userInfo');
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    const stored = localStorage.getItem('userInfo');
    return !!stored;
  });
  const [error, setError]     = useState(null);

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      // Verify token is still valid
      getProfile()
        .then(({ data }) => setUser((u) => ({ ...u, ...data })))
        .catch(() => {
          localStorage.removeItem('userInfo');
          setUser(null);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const { data } = await registerUser({ name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userInfo');
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem('userInfo', JSON.stringify(merged));
    setUser(merged);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
