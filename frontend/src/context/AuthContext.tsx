// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService from '../services/auth.service';
import { User, AuthContextType, RegisterData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();
      
      if (accessToken) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) setUser(currentUser);
      } else if (refreshToken) {
        await refreshSession();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setError(null);
      const data = await authService.login(email, password, rememberMe);
      setUser(data.user);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа');
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
      throw err;
    }
  };

  const refreshSession = async () => {
    try {
      const data = await authService.refreshToken();
      if (data?.user) setUser(data.user);
      return !!data;
    } catch {
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshSession,
        isAuthenticated: authService.isAuthenticated(),
        isAdmin: user?.role === 'admin',
        isBarista: user?.role === 'barista',
        isVolunteer: user?.role === 'volunteer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};