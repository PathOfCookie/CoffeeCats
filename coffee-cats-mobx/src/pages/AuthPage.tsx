// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../context/MobXContext';

const AuthPage: React.FC = observer(() => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'volunteer',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { auth } = useStores();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      if (isLogin) {
        await auth.login(formData.email, formData.password);
      } else {
        const { confirmPassword, ...registerData } = formData;
        await auth.register(registerData);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка авторизации');
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
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 40px rgba(75, 40, 20, 0.25)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '48px' }}>😺</span>
          <h1 style={{ color: '#5a3e2b' }}>CoffeeCats (MobX)</h1>
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

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Телефон (опционально)"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e6c9a8',
                    borderRadius: '30px',
                    fontSize: '16px'
                  }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={auth.loading}
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
              opacity: auth.loading ? 0.7 : 1
            }}
          >
            {auth.loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#a67b5b' }}>
          {isLogin ? 'Нет аккаунта? Переключитесь на "Регистрация"' : 'Уже есть аккаунт? Переключитесь на "Вход"'}
        </div>
      </div>
    </div>
  );
});

export default AuthPage;