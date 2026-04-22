// src/services/authService.ts
import axios from 'axios';
import { AUTH_SERVICE_URL } from './apiConfig';

interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'barista' | 'volunteer';
  created_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'barista' | 'volunteer';
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const mapUser = (user: BackendUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.created_at,
});

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await axios.post<{ accessToken: string; refreshToken: string; user: BackendUser }>(
      `${AUTH_SERVICE_URL}/auth/register`,
      data
    );
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: mapUser(response.data.user),
    };
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post<{ accessToken: string; refreshToken: string; user: BackendUser }>(
      `${AUTH_SERVICE_URL}/auth/login`,
      { email, password }
    );
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: mapUser(response.data.user),
    };
  },

  getCurrentUser: async (): Promise<User | null> => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  },
};