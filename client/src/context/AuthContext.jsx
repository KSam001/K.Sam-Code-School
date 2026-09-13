import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } catch (err) {
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const persistSession = (token, sessionUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const register = async (email, password, name) => {
    const res = await api.post('/auth/register', { email, password, name });
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const loginWithGoogle = async (accessToken) => {
    const res = await api.post('/auth/google', { token: accessToken });
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};