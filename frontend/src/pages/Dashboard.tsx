// src/pages/Dashboard.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductsQuery } from '../store/api/productsApi';
import { useGetCatsQuery } from '../store/api/catsApi';
import { logout } from '../store/slice/authSlice';
import { RootState, AppDispatch } from '../store';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Загрузка данных из API (с кэшированием)
  const { data: products, isLoading: productsLoading } = useGetProductsQuery(undefined);
  const { data: cats, isLoading: catsLoading } = useGetCatsQuery(undefined);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  if (productsLoading || catsLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #fae5d7 0%, #e6d5b8 100%)'
      }}>
        <div style={{ fontSize: '48px', animation: 'spin 1s infinite' }}>🐱</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fae5d7 0%, #e6d5b8 100%)',
      padding: '30px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Шапка */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          background: 'rgba(255,248,235,0.9)',
          padding: '20px',
          borderRadius: '20px'
        }}>
          <div>
            <h1 style={{ color: '#5a3e2b' }}>🐱 CoffeeCats</h1>
            <p style={{ color: '#8b6b4f' }}>Добро пожаловать, {user?.name}!</p>
            <p style={{ fontSize: '14px', color: '#a67b5b' }}>Роль: {
              user?.role === 'admin' ? 'Администратор' :
              user?.role === 'barista' ? 'Бариста' : 'Волонтёр'
            }</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#8b4513',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer'
            }}
          >
            Выйти
          </button>
        </div>

        {/* Товары */}
        <div style={{
          background: 'rgba(255,248,235,0.9)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#5a3e2b', marginBottom: '15px' }}>📦 Товары</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#8b4513', color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Название</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Цена</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Количество</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Статус</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product:any) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #e6c9a8' }}>
                  <td style={{ padding: '10px' }}>{product.name}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>{product.price} ₽</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    {product.stock} {product.unit}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: product.stock <= product.minQuantity ? '#ffc107' : '#28a745',
                      color: 'white'
                    }}>
                      {product.stock <= product.minQuantity ? 'Мало' : 'Норма'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Котики */}
        <div style={{
          background: 'rgba(255,248,235,0.9)',
          borderRadius: '20px',
          padding: '20px'
        }}>
          <h2 style={{ color: '#5a3e2b', marginBottom: '15px' }}>🐱 Котики</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#8b4513', color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Имя</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Окрас</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Возраст</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Статус</th>
              </tr>
            </thead>
            <tbody>
              {cats?.map((cat:any) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #e6c9a8' }}>
                  <td style={{ padding: '10px' }}>{cat.name}</td>
                  <td style={{ padding: '10px' }}>{cat.color}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{cat.age} лет</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: cat.status === 'in_cafe' ? '#17a2b8' : cat.status === 'reserved' ? '#ffc107' : '#28a745',
                      color: 'white'
                    }}>
                      {cat.status === 'in_cafe' && 'В кафе'}
                      {cat.status === 'reserved' && 'Забронирован'}
                      {cat.status === 'adopted' && 'Пристроен'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;