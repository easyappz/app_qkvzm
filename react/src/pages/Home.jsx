import React from 'react';
import { Button, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <div style={{ padding: 24 }} data-easytag="id1-src/pages/Home.jsx-root">
      <Card style={{ maxWidth: 600, margin: '24px auto' }} data-easytag="id2-src/pages/Home.jsx-card">
        <Title level={3} data-easytag="id3-src/pages/Home.jsx-title">Добро пожаловать</Title>
        {isAuthenticated ? (
          <>
            <Paragraph data-easytag="id4-src/pages/Home.jsx-hello">Здравствуйте, {user?.first_name || user?.email}!</Paragraph>
            <Button type="primary" onClick={() => navigate('/profile')} data-easytag="id5-src/pages/Home.jsx-go-profile">Перейти в профиль</Button>
          </>
        ) : (
          <>
            <Paragraph data-easytag="id6-src/pages/Home.jsx-desc">Пожалуйста, войдите или зарегистрируйтесь, чтобы продолжить.</Paragraph>
            <div style={{ display: 'flex', gap: 8 }} data-easytag="id7-src/pages/Home.jsx-actions">
              <Button type="primary" onClick={() => navigate('/login')} data-easytag="id8-src/pages/Home.jsx-login-btn">Войти</Button>
              <Button onClick={() => navigate('/register')} data-easytag="id9-src/pages/Home.jsx-register-btn">Зарегистрироваться</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Home;
