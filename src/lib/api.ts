import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Assuming NestJS backend operates on localhost:5001 by default locally.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
       // Auto logout if the token is invalid/expired
       useAuthStore.getState().logout();
       window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
