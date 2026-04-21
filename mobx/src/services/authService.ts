// src/services/authService.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost/api';

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
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<User | null> => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  },
};