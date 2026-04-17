// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService, { User } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBarista: boolean;
  isVolunteer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ⚠️ Нет /auth/me — просто берём пользователя из localStorage
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setError(null);
      const data = await authService.login(email, password, rememberMe);
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа');
      throw err;
    }
  };

  const register = async (data: any) => {
    try {
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
      throw err;
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