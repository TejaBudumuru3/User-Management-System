import axios from 'axios';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  console.log(token);
  
  if (token) {
    console.log(token);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
