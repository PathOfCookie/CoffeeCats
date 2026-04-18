// packages/mf-auth/src/AuthPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { User } from '@coffee-cats/shared';

interface AuthPageProps {
  onLogin: (user: User, token: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'volunteer',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, role: formData.role };
      
      const response = await axios.post(`http://localhost:3001${endpoint}`, payload);
      
      if (response.data.accessToken) {
        onLogin(response.data.user, response.data.accessToken);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #fae5d7 0%, #e6d5b8 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 248, 235, 0.95)',
        borderRadius: '40px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 40px rgba(75, 40, 20, 0.25)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '48px' }}>😺</span>
          <h1 style={{ color: '#5a3e2b' }}>CoffeeCats</h1>
          <p style={{ color: '#8b6b4f' }}>антикафе с котиками</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '30px',
              background: isLogin ? 'linear-gradient(135deg, #8b4513, #d2691e)' : '#e6c9a8',
              color: isLogin ? 'white' : '#5a3e2b',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Вход
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '30px',
              background: !isLogin ? 'linear-gradient(135deg, #8b4513, #d2691e)' : '#e6c9a8',
              color: !isLogin ? 'white' : '#5a3e2b',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Регистрация
          </button>
        </div>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e6c9a8',
                  borderRadius: '30px',
                  fontSize: '16px'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e6c9a8',
                borderRadius: '30px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e6c9a8',
                borderRadius: '30px',
                fontSize: '16px'
              }}
            />
          </div>

          {!isLogin && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Подтвердите пароль"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e6c9a8',
                    borderRadius: '30px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e6c9a8',
                    borderRadius: '30px',
                    fontSize: '16px',
                    background: 'white'
                  }}
                >
                  <option value="volunteer">😺 КОТИКИ!!! - любитель котиков</option>
                  <option value="barista">☕ Дайте КОФЕ!!! - кофеман</option>
                  <option value="admin">💼 Work work work - работяга</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #8b4513, #d2691e)',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;