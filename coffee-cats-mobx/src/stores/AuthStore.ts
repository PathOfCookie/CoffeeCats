// src/stores/AuthStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import { authService, User, AuthResponse } from '../services/authService';

class AuthStore {
  user: User | null = null;
  isAuthenticated: boolean = false;
  loading: boolean = false;
  error: string | null = null;
  accessToken: string | null = null;
  refreshToken: string | null = null;

  constructor() {
    makeAutoObservable(this);
    
    // Восстановление сессии при загрузке
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      this.accessToken = token;
      this.user = JSON.parse(savedUser);
      this.isAuthenticated = true;
    }
  }

  login = async (email: string, password: string) => {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await authService.login(email, password);
      
      runInAction(() => {
        this.user = response.user;
        this.accessToken = response.accessToken;
        this.refreshToken = response.refreshToken;
        this.isAuthenticated = true;
        this.loading = false;
        
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      });
      
      return response;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Ошибка входа';
        this.loading = false;
      });
      throw error;
    }
  };

  register = async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }) => {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await authService.register(data);
      
      runInAction(() => {
        this.user = response.user;
        this.accessToken = response.accessToken;
        this.refreshToken = response.refreshToken;
        this.isAuthenticated = true;
        this.loading = false;
        
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      });
      
      return response;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Ошибка регистрации';
        this.loading = false;
      });
      throw error;
    }
  };

  logout = () => {
    this.user = null;
    this.isAuthenticated = false;
    this.accessToken = null;
    this.refreshToken = null;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  get isAdmin() {
    return this.user?.role === 'admin';
  }

  get isBarista() {
    return this.user?.role === 'barista';
  }

  get isVolunteer() {
    return this.user?.role === 'volunteer';
  }
}

export default AuthStore;