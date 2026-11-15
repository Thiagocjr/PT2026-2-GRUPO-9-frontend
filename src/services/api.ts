import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('@App:token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})