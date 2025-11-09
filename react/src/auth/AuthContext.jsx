import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginRequest, registerRequest, getProfileRequest } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const isAuthenticated = !!accessToken && !!refreshToken;

  const setTokens = useCallback((access, refresh) => {
    if (access) {
      setAccessToken(access);
      localStorage.setItem('access', access);
      localStorage.setItem('token', access); // compatibility with axios instance
    } else {
      setAccessToken(null);
      localStorage.removeItem('access');
      localStorage.removeItem('token');
    }
    if (refresh) {
      setRefreshToken(refresh);
      localStorage.setItem('refresh', refresh);
    } else {
      setRefreshToken(null);
      localStorage.removeItem('refresh');
    }
  }, []);

  const loadUserFromStorage = useCallback(async () => {
    const storedAccess = localStorage.getItem('access');
    const storedRefresh = localStorage.getItem('refresh');
    if (storedAccess && storedRefresh) {
      setTokens(storedAccess, storedRefresh);
      try {
        const profile = await getProfileRequest();
        setUser(profile);
      } catch (e) {
        // tokens invalid
        setTokens(null, null);
        setUser(null);
      }
    }
  }, [setTokens]);

  const login = useCallback(async ({ email, password }) => {
    const data = await loginRequest({ email, password });
    setTokens(data.access, data.refresh);
    setUser(data.user);
    return data;
  }, [setTokens]);

  const register = useCallback(async ({ email, first_name, last_name, password }) => {
    const data = await registerRequest({ email, first_name, last_name, password });
    setTokens(data.access, data.refresh);
    setUser(data.user);
    return data;
  }, [setTokens]);

  const logout = useCallback(() => {
    setTokens(null, null);
    setUser(null);
    message.success('Вы вышли из аккаунта');
    if (location.pathname !== '/') {
      navigate('/');
    }
  }, [location.pathname, navigate, setTokens]);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // Listen tokens refreshed from axios interceptor
  useEffect(() => {
    const onTokenRefreshed = () => {
      const newAccess = localStorage.getItem('access');
      if (newAccess) setAccessToken(newAccess);
    };
    const onLogout = () => logout();
    window.addEventListener('auth:tokenRefreshed', onTokenRefreshed);
    window.addEventListener('auth:logout', onLogout);
    return () => {
      window.removeEventListener('auth:tokenRefreshed', onTokenRefreshed);
      window.removeEventListener('auth:logout', onLogout);
    };
  }, [logout]);

  const value = useMemo(() => ({
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    setTokens,
    login,
    register,
    logout,
    loadUserFromStorage,
    setUser,
  }), [user, accessToken, refreshToken, isAuthenticated, setTokens, login, register, logout, loadUserFromStorage]);

  return (
    <div data-easytag="id1-src/auth/AuthContext.jsx">
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </div>
  );
};

export const useAuth = () => useContext(AuthContext);
