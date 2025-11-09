import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { getProfileRequest, updateProfileRequest } from '../api/auth';
import { useAuth } from '../auth/AuthContext';

const { Title } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { setUser } = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const profile = await getProfileRequest();
        if (mounted) {
          form.setFieldsValue({ email: profile.email, first_name: profile.first_name, last_name: profile.last_name });
        }
      } catch (e) {
        message.error('Не удалось загрузить профиль');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      const updated = await updateProfileRequest(values);
      setUser(updated);
      message.success('Профиль обновлён');
    } catch (e) {
      const data = e?.response?.data;
      const errMsg = typeof data === 'string' ? data : (data?.detail || 'Ошибка обновления профиля');
      message.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 24 }} data-easytag="id1-src/pages/Profile.jsx-root">
      <Card style={{ maxWidth: 520, margin: '24px auto' }} loading={loading} data-easytag="id2-src/pages/Profile.jsx-card">
        <Title level={3} data-easytag="id3-src/pages/Profile.jsx-title">Профиль</Title>
        <Form form={form} layout="vertical" onFinish={onFinish} data-easytag="id4-src/pages/Profile.jsx-form">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Неверный формат email' }]} data-easytag="id5-src/pages/Profile.jsx-email">
            <Input type="email" placeholder="Введите email" data-easytag="id6-src/pages/Profile.jsx-email-input" />
          </Form.Item>
          <Form.Item label="Имя" name="first_name" rules={[{ required: true, message: 'Введите имя' }]} data-easytag="id7-src/pages/Profile.jsx-firstname">
            <Input placeholder="Введите имя" data-easytag="id8-src/pages/Profile.jsx-firstname-input" />
          </Form.Item>
          <Form.Item label="Фамилия" name="last_name" rules={[{ required: true, message: 'Введите фамилию' }]} data-easytag="id9-src/pages/Profile.jsx-lastname">
            <Input placeholder="Введите фамилию" data-easytag="id10-src/pages/Profile.jsx-lastname-input" />
          </Form.Item>
          <Form.Item data-easytag="id11-src/pages/Profile.jsx-actions">
            <Button type="primary" htmlType="submit" loading={saving} block data-easytag="id12-src/pages/Profile.jsx-submit">Сохранить</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
