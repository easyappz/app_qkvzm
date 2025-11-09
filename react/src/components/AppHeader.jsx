import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const { Header } = Layout;

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const selectedKeys = [location.pathname];

  const items = [
    { key: '/', label: <Link to="/" data-easytag="id1-src/components/AppHeader.jsx-link-home">Главная</Link> },
    ...(isAuthenticated ? [{ key: '/profile', label: <Link to="/profile" data-easytag="id2-src/components/AppHeader.jsx-link-profile">Профиль</Link> }] : []),
    !isAuthenticated
      ? { key: '/login', label: <Link to="/login" data-easytag="id3-src/components/AppHeader.jsx-link-login">Войти</Link> }
      : { key: 'logout', label: <span onClick={() => { logout(); navigate('/'); }} data-easytag="id4-src/components/AppHeader.jsx-logout">Выйти</span> },
  ];

  return (
    <div data-easytag="id1-src/components/AppHeader.jsx">
      <Header style={{ display: 'flex', alignItems: 'center' }} data-easytag="id2-src/components/AppHeader.jsx-header">
        <div style={{ color: '#fff', marginRight: 24 }} data-easytag="id3-src/components/AppHeader.jsx-logo">Моё приложение</div>
        <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys} items={items} style={{ flex: 1 }} data-easytag="id4-src/components/AppHeader.jsx-menu" />
      </Header>
    </div>
  );
};

export default AppHeader;
