import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextObject';
import api from '../api/axios';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // Only block rendering when we have a token but no cached user to show
  // optimistically. If a cached user already exists, render it immediately
  // and revalidate with the server in the background (stale-while-revalidate).
  const [loading, setLoading] = useState(() => {
    return Boolean(localStorage.getItem('token')) && !localStorage.getItem('user');
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    api.get('/auth/me')
      .then((res) => {
        if (cancelled) return;
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};