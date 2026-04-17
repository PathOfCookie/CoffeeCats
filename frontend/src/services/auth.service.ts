// src/services/auth.service.ts
import { apiService } from './api';
import Cookies from 'js-cookie';
import { AuthResponse, RegisterData, User } from '../types';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    if (response.data.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken, false);
      this.setUser(response.data.user);
    }
    return response.data;
  }

  async login(email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> {
      
    const response = await apiService.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken, rememberMe);
      this.setUser(response.data.user);
    }
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;
    
    try {
      const response = await apiService.post<AuthResponse>('/auth/refresh', { refreshToken });
      this.setTokens(response.data.accessToken, response.data.refreshToken, false);
      if (response.data.user) this.setUser(response.data.user);
      return response.data;
    } catch {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string, rememberMe: boolean): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    if (!rememberMe) {
      Cookies.set('accessToken', accessToken, { expires: 1 / 24 });
      Cookies.set('refreshToken', refreshToken, { expires: 7 });
    }
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken') || Cookies.get('accessToken') || null;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken') || null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export default new AuthService();