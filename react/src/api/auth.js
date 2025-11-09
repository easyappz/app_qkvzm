import instance from './axios';

export async function loginRequest({ email, password }) {
  const res = await instance.post('/api/auth/login', { email, password });
  return res.data;
}

export async function registerRequest({ email, first_name, last_name, password }) {
  const res = await instance.post('/api/auth/register', { email, first_name, last_name, password });
  return res.data;
}

export async function refreshTokenRequest(refresh) {
  const res = await instance.post('/api/auth/refresh', { refresh });
  return res.data;
}

export async function getProfileRequest() {
  const res = await instance.get('/api/profile');
  return res.data;
}

export async function updateProfileRequest(payload) {
  const res = await instance.put('/api/profile', payload);
  return res.data;
}
