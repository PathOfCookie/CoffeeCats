// src/pages/Dashboard.tsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../context/MobXContext';

const Dashboard: React.FC = observer(() => {
  const { auth, products, cats, inventory } = useStores();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      products.fetchProducts();
      cats.fetchCats();
      inventory.fetchInventory(); // ✅ добавляем загрузку склада
    }
  }, [auth.isAuthenticated]);

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  // Получаем товары с низким запасом
  const lowStockProducts = products.items.filter(p => p.stock <= p.minQuantity);
  const criticalStockProducts = products.items.filter(p => p.stock <= p.minQuantity * 0.5);

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
            <p style={{ color: '#8b6b4f' }}>Добро пожаловать, {auth.user?.name}!</p>
            <p style={{ fontSize: '14px', color: '#a67b5b' }}>Роль: {
              auth.user?.role === 'admin' ? 'Администратор' :
              auth.user?.role === 'barista' ? 'Бариста' : 'Волонтёр'
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

        {/* Карточки статистики */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(255,248,235,0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '32px' }}>📦</span>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{products.items.length}</p>
            <p style={{ color: '#a67b5b' }}>Всего товаров</p>
          </div>

          <div style={{
            background: 'rgba(255,248,235,0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '32px' }}>⚠️</span>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{lowStockProducts.length}</p>
            <p style={{ color: '#a67b5b' }}>Низкий запас</p>
          </div>

          <div style={{
            background: 'rgba(255,248,235,0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            border: criticalStockProducts.length > 0 ? '2px solid #dc3545' : 'none'
          }}>
            <span style={{ fontSize: '32px' }}>🔥</span>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{criticalStockProducts.length}</p>
            <p style={{ color: '#a67b5b' }}>Критично мало</p>
          </div>

          <div style={{
            background: 'rgba(255,248,235,0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '32px' }}>🐱</span>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{cats.catsInCafe.length}</p>
            <p style={{ color: '#a67b5b' }}>Котиков в кафе</p>
          </div>
        </div>

        {/* Две колонки */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Левая колонка — товары с низким запасом */}
          <div style={{
            background: 'rgba(255,248,235,0.9)',
            borderRadius: '20px',
            padding: '20px'
          }}>
            <h2 style={{ color: '#5a3e2b', marginBottom: '15px' }}>⚠️ Требует внимания</h2>
            {lowStockProducts.length === 0 ? (
              <p style={{ color: '#28a745', textAlign: 'center', padding: '20px' }}>✅ Все товары в норме</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lowStockProducts.map(product => (
                  <div key={product.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '15px',
                    borderLeft: `4px solid ${product.stock <= product.minQuantity * 0.5 ? '#dc3545' : '#ffc107'}`
                  }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{product.name}</span>
                      <p style={{ fontSize: '12px', color: '#a67b5b' }}>
                        Осталось: {product.stock} {product.unit} (мин. {product.minQuantity} {product.unit})
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: product.stock <= product.minQuantity * 0.5 ? '#dc3545' : '#ffc107',
                      color: 'white'
                    }}>
                      {product.stock <= product.minQuantity * 0.5 ? 'Критично' : 'Мало'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/inventory')}
              style={{
                marginTop: '15px',
                width: '100%',
                padding: '10px',
                background: '#8b4513',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                cursor: 'pointer'
              }}
            >
              Перейти на склад →
            </button>
          </div>

          {/* Правая колонка — котики */}
          <div style={{
            background: 'rgba(255,248,235,0.9)',
            borderRadius: '20px',
            padding: '20px'
          }}>
            <h2 style={{ color: '#5a3e2b', marginBottom: '15px' }}>🐱 Наши котики</h2>
            {cats.catsInCafe.length === 0 ? (
              <p style={{ color: '#a67b5b', textAlign: 'center', padding: '20px' }}>Пока нет котиков в кафе</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cats.catsInCafe.slice(0, 5).map(cat => (
                  <div key={cat.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '15px'
                  }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      <p style={{ fontSize: '12px', color: '#a67b5b' }}>{cat.color}, {cat.age} {cat.age === 1 ? 'год' : cat.age < 5 ? 'года' : 'лет'}</p>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: cat.status === 'in_cafe' ? '#17a2b8' : '#ffc107',
                      color: 'white'
                    }}>
                      {cat.status === 'in_cafe' ? 'В кафе' : 'Забронирован'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/cats')}
              style={{
                marginTop: '15px',
                width: '100%',
                padding: '10px',
                background: '#8b4513',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                cursor: 'pointer'
              }}
            >
              Все котики →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dashboard;