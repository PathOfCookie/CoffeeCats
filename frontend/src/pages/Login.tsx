// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/dashboard');
    } catch (err) {
      // Ошибка уже обработана в контексте
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fae5d7 0%, #e6d5b8 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 248, 235, 0.95)',
        borderRadius: '40px',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 40px rgba(75, 40, 20, 0.25)',
        border: '1px solid rgba(255, 235, 200, 0.6)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '48px' }}>😺</span>
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #8b4513, #d2691e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Coffee<span style={{ color: '#d2691e' }}>Cats</span>
            </h1>
          </div>
          <p style={{ color: '#8b6b4f' }}>антикафе с котиками</p>
        </div>

        {error && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#5a3e2b', fontWeight: 600 }}>
              <span style={{ marginRight: '8px' }}>📧</span>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="kotik@coffee.com"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid #e6c9a8',
                borderRadius: '30px',
                fontSize: '16px',
                background: 'rgba(255, 248, 240, 0.9)'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#5a3e2b', fontWeight: 600 }}>
              <span style={{ marginRight: '8px' }}>🔒</span>
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid #e6c9a8',
                borderRadius: '30px',
                fontSize: '16px',
                background: 'rgba(255, 248, 240, 0.9)'
              }}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <span style={{ color: '#7b5f47' }}>Запомнить меня</span>
            </label>
            <Link to="/forgot-password" style={{ color: '#d2691e', textDecoration: 'none' }}>
              Забыли пароль?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 24px',
              fontSize: '18px',
              fontWeight: 600,
              color: 'white',
              background: 'linear-gradient(135deg, #8b4513, #d2691e)',
              border: 'none',
              borderRadius: '50px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {loading ? 'Вход...' : 'Войти ☕'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <div style={{ 
            background: '#fff3e0',
            borderRadius: '30px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '24px', display: 'block', color: '#8b4513' }}>4😸</span>
              <span style={{ fontSize: '12px', color: '#a67b5b' }}>котиков у нас</span>
            </div>
            <div style={{ width: '2px', background: '#e6c9a8' }}></div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '24px', display: 'block', color: '#8b4513' }}>2😻</span>
              <span style={{ fontSize: '12px', color: '#a67b5b' }}>нашли дом</span>
            </div>
          </div>

          <div>
            <span style={{ color: '#7b5f47' }}>Ещё нет аккаунта? </span>
            <Link to="/register" style={{ 
              color: '#8b4513', 
              fontWeight: 600,
              textDecoration: 'none'
            }}>
              Присоединиться к команде 🐱
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;