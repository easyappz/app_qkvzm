import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register({
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
      });
      message.success('Регистрация успешна');
      navigate('/profile', { replace: true });
    } catch (e) {
      const data = e?.response?.data;
      const errMsg = typeof data === 'string' ? data : (data?.detail || data?.email?.[0] || 'Ошибка регистрации');
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }} data-easytag="id1-src/pages/Register.jsx-root">
      <Card style={{ maxWidth: 520, margin: '24px auto' }} data-easytag="id2-src/pages/Register.jsx-card">
        <Title level={3} data-easytag="id3-src/pages/Register.jsx-title">Регистрация</Title>
        <Form layout="vertical" onFinish={onFinish} data-easytag="id4-src/pages/Register.jsx-form">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Неверный формат email' }]} data-easytag="id5-src/pages/Register.jsx-email">
            <Input type="email" placeholder="Введите email" data-easytag="id6-src/pages/Register.jsx-email-input" />
          </Form.Item>
          <Form.Item label="Имя" name="first_name" rules={[{ required: true, message: 'Введите имя' }]} data-easytag="id7-src/pages/Register.jsx-firstname">
            <Input placeholder="Введите имя" data-easytag="id8-src/pages/Register.jsx-firstname-input" />
          </Form.Item>
          <Form.Item label="Фамилия" name="last_name" rules={[{ required: true, message: 'Введите фамилию' }]} data-easytag="id9-src/pages/Register.jsx-lastname">
            <Input placeholder="Введите фамилию" data-easytag="id10-src/pages/Register.jsx-lastname-input" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }, { min: 8, message: 'Минимум 8 символов' }]} data-easytag="id11-src/pages/Register.jsx-password">
            <Input.Password placeholder="Введите пароль" data-easytag="id12-src/pages/Register.jsx-password-input" />
          </Form.Item>
          <Form.Item data-easytag="id13-src/pages/Register.jsx-actions">
            <Button type="primary" htmlType="submit" loading={loading} block data-easytag="id14-src/pages/Register.jsx-submit">Создать аккаунт</Button>
          </Form.Item>
          <div data-easytag="id15-src/pages/Register.jsx-login-link">Уже есть аккаунт? <Link to="/login">Войти</Link></div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
