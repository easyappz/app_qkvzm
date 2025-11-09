import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import ErrorBoundary from './ErrorBoundary';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    const routes = ['/', '/login', '/register', '/profile'];
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      try { window.handleRoutes(routes); } catch (_) {}
    }
  }, []);

  return (
    <ErrorBoundary>
      <div data-easytag="id1-src/App.js">
        <ConfigProvider locale={ruRU}>
          <AuthProvider>
            <BrowserRouter>
              <AppHeader />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ConfigProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
