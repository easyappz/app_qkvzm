import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login({ email: values.email, password: values.password });
      message.success('Вы успешно вошли');
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    } catch (e) {
      const errMsg = e?.response?.data?.detail || 'Неверный email или пароль';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }} data-easytag="id1-src/pages/Login.jsx-root">
      <Card style={{ maxWidth: 480, margin: '24px auto' }} data-easytag="id2-src/pages/Login.jsx-card">
        <Title level={3} data-easytag="id3-src/pages/Login.jsx-title">Вход</Title>
        <Form layout="vertical" onFinish={onFinish} data-easytag="id4-src/pages/Login.jsx-form">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Неверный формат email' }]} data-easytag="id5-src/pages/Login.jsx-email">
            <Input type="email" placeholder="Введите email" data-easytag="id6-src/pages/Login.jsx-email-input" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }]} data-easytag="id7-src/pages/Login.jsx-password">
            <Input.Password placeholder="Введите пароль" data-easytag="id8-src/pages/Login.jsx-password-input" />
          </Form.Item>
          <Form.Item data-easytag="id9-src/pages/Login.jsx-actions">
            <Button type="primary" htmlType="submit" loading={loading} block data-easytag="id10-src/pages/Login.jsx-submit">Войти</Button>
          </Form.Item>
          <div data-easytag="id11-src/pages/Login.jsx-register-link">Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
