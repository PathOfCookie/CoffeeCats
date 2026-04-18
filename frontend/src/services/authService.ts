// src/services/authService.ts
import axios from 'axios';

// Прямое подключение к микросервису авторизации
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:3001';

const authApi = axios.create({
  baseURL: AUTH_SERVICE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'barista' | 'volunteer';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  // Регистрация
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/register', data);
    return response.data;
  },

  // Вход
  login: async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/login', { email, password, rememberMe });
    return response.data;
  },

  // Обновление токена
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await authApi.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};