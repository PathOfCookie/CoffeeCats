import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'volunteer' as 'volunteer' | 'barista' | 'admin',
    agreeTerms: false
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Сбрасываем ошибку пароля при изменении
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    // Проверка длины пароля
    if (formData.password.length < 6) {
      setPasswordError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      // Ошибка уже обработана в контексте
    }
  };

  // Функция для определения силы пароля
  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (!password) return { strength: '', color: '' };
    
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [hasLetters, hasNumbers, hasSpecial].filter(Boolean).length;
    
    if (password.length < 6) return { strength: 'Слишком короткий', color: '#dc3545' };
    if (score === 1) return { strength: 'Слабый', color: '#ffc107' };
    if (score === 2) return { strength: 'Средний', color: '#17a2b8' };
    return { strength: 'Сильный', color: '#28a745' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fae5d7 0%, #e6d5b8 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Декоративные элементы */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        top: '-100px',
        right: '-100px',
        background: '#d2691e',
        opacity: 0.15,
        borderRadius: '50%',
        filter: 'blur(20px)'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        bottom: '-150px',
        left: '-150px',
        background: '#8b4513',
        opacity: 0.1,
        borderRadius: '50%',
        filter: 'blur(20px)'
      }}></div>
      
      <div style={{
        background: 'rgba(255, 248, 235, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '40px',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 20px 40px rgba(75, 40, 20, 0.25)',
        border: '1px solid rgba(255, 235, 200, 0.6)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Шапка */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '48px', animation: 'wave 2s infinite' }}>😺</span>
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #8b4513, #d2691e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Coffee<span style={{ color: '#d2691e' }}>Cats</span>
            </h1>
          </div>
          <p style={{ 
            color: '#8b6b4f', 
            fontSize: '16px',
            background: 'rgba(210, 105, 30, 0.1)',
            display: 'inline-block',
            padding: '5px 15px',
            borderRadius: '50px'
          }}>
            стань частью нашей команды
          </p>
        </div>

        {/* Сообщение об ошибке */}
        {(error || passwordError) && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '15px', 
            borderRadius: '15px',
            marginBottom: '25px',
            textAlign: 'center',
            border: '1px solid #f5c6cb'
          }}>
            {passwordError || error}
          </div>
        )}

        {/* Форма регистрации */}
        <form onSubmit={handleSubmit}>
          {/* Имя */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '8px', 
              color: '#5a3e2b', 
              fontWeight: 600 
            }}>
              <span style={{ fontSize: '20px' }}>👤</span>
              Ваше имя
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Например: Мурлыка"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid #e6c9a8',
                borderRadius: '30px',
                fontSize: '16px',
                background: 'rgba(255, 248, 240, 0.9)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#d2691e'}
              onBlur={(e) => e.target.style.borderColor = '#e6c9a8'}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '8px', 
              color: '#5a3e2b', 
              fontWeight: 600 
            }}>
              <span style={{ fontSize: '20px' }}>📧</span>
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
                background: 'rgba(255, 248, 240, 0.9)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#d2691e'}
              onBlur={(e) => e.target.style.borderColor = '#e6c9a8'}
            />
          </div>

          {/* Пароль и подтверждение */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            {/* Пароль */}
            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '8px', 
                color: '#5a3e2b', 
                fontWeight: 600 
              }}>
                <span style={{ fontSize: '20px' }}>🔒</span>
                Пароль
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="минимум 6 символов"
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid #e6c9a8',
                  borderRadius: '30px',
                  fontSize: '16px',
                  background: 'rgba(255, 248, 240, 0.9)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#d2691e'}
                onBlur={(e) => e.target.style.borderColor = '#e6c9a8'}
              />
              {/* Индикатор силы пароля */}
              {formData.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{
                    height: '4px',
                    background: '#e0e0e0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: formData.password.length < 6 ? '33%' : 
                             passwordStrength.strength === 'Слабый' ? '33%' :
                             passwordStrength.strength === 'Средний' ? '66%' : '100%',
                      height: '100%',
                      background: passwordStrength.color,
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '12px', color: passwordStrength.color }}>
                    {passwordStrength.strength}
                  </span>
                </div>
              )}
            </div>

            {/* Подтверждение пароля */}
            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '8px', 
                color: '#5a3e2b', 
                fontWeight: 600 
              }}>
                <span style={{ fontSize: '20px' }}>✓</span>
                Подтвердите
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="повторите пароль"
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: `2px solid ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? '#dc3545'
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? '#28a745'
                      : '#e6c9a8'
                  }`,
                  borderRadius: '30px',
                  fontSize: '16px',
                  background: 'rgba(255, 248, 240, 0.9)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#d2691e'}
                onBlur={(e) => e.target.style.borderColor = '#e6c9a8'}
              />
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <span style={{ fontSize: '12px', color: '#28a745', display: 'block', marginTop: '5px' }}>
                  ✓ Пароли совпадают
                </span>
              )}
            </div>
          </div>

          {/* Роль */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '8px', 
              color: '#5a3e2b', 
              fontWeight: 600 
            }}>
              <span style={{ fontSize: '20px' }}>🎭</span>
              Кто вы в кафе?
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid #e6c9a8',
                borderRadius: '30px',
                fontSize: '16px',
                background: 'rgba(255, 248, 240, 0.9)',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="volunteer">😺 КОТИКИ!!! - любитель котиков</option>
              <option value="barista">☕ Дайте КОФЕ!!! - кофеман</option>
              <option value="admin">💼 Work work work - работяга</option>
            </select>
          </div>

          {/* Согласие с правилами */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '25px',
            padding: '15px',
            background: '#fff3e0',
            borderRadius: '50px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '20px',
                height: '20px',
                accentColor: '#d2691e',
                cursor: 'pointer'
              }}
            />
            <span style={{ color: '#7b5f47', fontSize: '14px' }}>
              Я согласен с <Link to="/terms" style={{ color: '#d2691e', textDecoration: 'none' }}>правилами кафе</Link> и 
              обещаю заботиться о котиках ❤️
            </span>
          </label>

          {/* Кнопка регистрации */}
          <button
            type="submit"
            disabled={loading || !formData.agreeTerms}
            style={{
              width: '100%',
              padding: '16px 24px',
              fontSize: '18px',
              fontWeight: 600,
              color: 'white',
              background: loading || !formData.agreeTerms
                ? 'linear-gradient(135deg, #a67b5b, #c4a484)'
                : 'linear-gradient(135deg, #8b4513, #d2691e)',
              border: 'none',
              borderRadius: '50px',
              cursor: loading || !formData.agreeTerms ? 'not-allowed' : 'pointer',
              opacity: loading || !formData.agreeTerms ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 16px rgba(139, 69, 19, 0.3)'
            }}
          >
            {loading ? (
              <>
                <span style={{ animation: 'spin 1s infinite' }}>🐱</span>
                Регистрация...
              </>
            ) : (
              <>
                <span>Зарегистрироваться</span>
                <span style={{ fontSize: '24px' }}>🐱</span>
              </>
            )}
          </button>
        </form>

        {/* Ссылка на вход */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#7b5f47' }}>Уже есть аккаунт? </span>
          <Link 
            to="/login" 
            style={{ 
              color: '#8b4513', 
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#d2691e'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#8b4513'}
          >
            Вернуться ко входу ☕
          </Link>
        </div>

        {/* Забавные факты */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(210, 105, 30, 0.1)',
          borderRadius: '20px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#8b4513'
        }}>
          <span style={{ fontSize: '20px', display: 'block', marginBottom: '5px' }}>🐱</span>
          Знаете ли вы? Кошки проводят 70% своей жизни во сне, 
          а оставшиеся 30% — требуют вкусняшки и внимание! 
          У нас они получают и то, и другое ❤️
        </div>
      </div>

      {/* Стили для анимаций */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;