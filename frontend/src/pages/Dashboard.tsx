// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Типы данных
interface DashboardStats {
  catsInCafe: number;
  catsAdopted: number;
  coffeeToday: number;
  teaToday: number;
  volunteers: number;
  baristas: number;
  workers: number;
  lowStockItems: number;
  criticalStockItems: number;
  pendingAdopters: number;
}

interface RecentCat {
  id: string;
  name: string;
  age: number;
  color: string;
  personality: string;
  status: 'in_cafe' | 'reserved' | 'adopted';
}

interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  unit: string;
  minQuantity: number;
  category: string;
}

// Мок-данные
const mockStats: DashboardStats = {
  catsInCafe: 4,
  catsAdopted: 2,
  coffeeToday: 42,
  teaToday: 18,
  volunteers: 3,
  baristas: 2,
  workers: 1,
  lowStockItems: 3,
  criticalStockItems: 1,
  pendingAdopters: 2
};

const mockRecentCats: RecentCat[] = [
  {
    id: '1',
    name: 'Барсик',
    age: 2,
    color: 'рыжий',
    personality: 'Любит спать на мешках с кофе',
    status: 'in_cafe'
  },
  {
    id: '2',
    name: 'Муся',
    age: 1,
    color: 'серая',
    personality: 'Обожает коробки',
    status: 'in_cafe'
  },
  {
    id: '3',
    name: 'Снежок',
    age: 3,
    color: 'белый',
    personality: 'Хитрый, ворует молоко',
    status: 'adopted'
  },
  {
    id: '4',
    name: 'Карамелька',
    age: 1,
    color: 'рыжая',
    personality: 'Игривая, любит солнечных зайчиков',
    status: 'reserved'
  }
];

const mockLowStock: LowStockItem[] = [
  {
    id: '1',
    name: 'Корм для котиков',
    stock: 1.2,
    unit: 'кг',
    minQuantity: 3,
    category: 'litter'
  },
  {
    id: '2',
    name: 'Наполнитель',
    stock: 2,
    unit: 'кг',
    minQuantity: 5,
    category: 'litter'
  },
  {
    id: '3',
    name: 'Зерна эспрессо',
    stock: 1.5,
    unit: 'кг',
    minQuantity: 2,
    category: 'coffee'
  }
];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recentCats, setRecentCats] = useState<RecentCat[]>(mockRecentCats);
  const [lowStock, setLowStock] = useState<LowStockItem[]>(mockLowStock);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { user, isAdmin, isBarista, isVolunteer } = useAuth();

  // Обновляем время каждую минуту
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Получаем приветствие в зависимости от времени
  const getGreeting = (): string => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  // Получаем роль пользователя для отображения
  const getUserRoleDisplay = (): string => {
    if (isAdmin) return '💼 Work work work';
    if (isBarista) return '☕ Дайте КОФЕ!!!';
    if (isVolunteer) return '😺 КОТИКИ!!!';
    return '👤 Гость';
  };

  // Получаем цвет для статуса запаса
  const getStockStatusColor = (stock: number, minQuantity: number): string => {
    if (stock <= minQuantity * 0.5) return '#dc3545';
    if (stock <= minQuantity) return '#ffc107';
    return '#28a745';
  };

  // Получаем иконку для категории
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'coffee': return '☕';
      case 'tea': return '🫖';
      case 'litter': return '🧻';
      case 'food': return '🥐';
      default: return '📦';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fae5d7 0%, #e6d5b8 100%)',
      padding: '30px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Декоративные элементы */}
      <div style={{
        position: 'fixed',
        width: '300px',
        height: '300px',
        top: '-100px',
        right: '-100px',
        background: '#d2691e',
        opacity: 0.15,
        borderRadius: '50%',
        filter: 'blur(20px)',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'fixed',
        width: '400px',
        height: '400px',
        bottom: '-150px',
        left: '-150px',
        background: '#8b4513',
        opacity: 0.1,
        borderRadius: '50%',
        filter: 'blur(20px)',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'fixed',
        fontSize: '60px',
        top: '20%',
        left: '5%',
        opacity: 0.1,
        transform: 'rotate(-10deg)',
        zIndex: 0
      }}>🐾</div>
      <div style={{
        position: 'fixed',
        fontSize: '60px',
        bottom: '20%',
        right: '5%',
        opacity: 0.1,
        transform: 'rotate(25deg)',
        zIndex: 0
      }}>🐾</div>

      {/* Основной контент */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Шапка с приветствием */}
        <div style={{
          background: 'rgba(255, 248, 235, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '25px 30px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 16px rgba(75, 40, 20, 0.15)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '48px' }}>😺</span>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #8b4513, #d2691e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  CoffeeCats
                </h1>
                <p style={{ color: '#8b6b4f', marginTop: '5px' }}>
                  {getGreeting()}, {user?.name || 'друг'}! {getUserRoleDisplay()}
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#5a3e2b', fontWeight: 600 }}>
              {currentTime.toLocaleDateString('ru-RU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p style={{ color: '#a67b5b' }}>
              {currentTime.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>

        {/* Баннер открытия */}
        <div style={{
          background: 'linear-gradient(135deg, #8b4513, #d2691e)',
          borderRadius: '20px',
          padding: '20px 30px',
          marginBottom: '30px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '48px' }}>🎉</span>
            <div>
              <h2 style={{ margin: '0 0 5px 0' }}>Мы открылись!</h2>
              <p style={{ opacity: 0.9, margin: 0 }}>
                Первая неделя работы — уже {stats.coffeeToday + stats.teaToday} чашек счастья
              </p>
            </div>
          </div>
          <span style={{ fontSize: '48px' }}>☕</span>
        </div>

        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            backdropFilter: 'blur(5px)',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <span style={{ fontSize: '36px' }}>🐱</span>
            <div>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>
                {stats.catsInCafe}
              </span>
              <p style={{ color: '#a67b5b', margin: 0 }}>котиков в кафе</p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            backdropFilter: 'blur(5px)',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <span style={{ fontSize: '36px' }}>🏠</span>
            <div>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>
                {stats.catsAdopted}
              </span>
              <p style={{ color: '#a67b5b', margin: 0 }}>нашли дом</p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            backdropFilter: 'blur(5px)',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <span style={{ fontSize: '36px' }}>☕</span>
            <div>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>
                {stats.coffeeToday}
              </span>
              <p style={{ color: '#a67b5b', margin: 0 }}>чашек кофе</p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            backdropFilter: 'blur(5px)',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <span style={{ fontSize: '36px' }}>⚠️</span>
            <div>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>
                {stats.criticalStockItems}
              </span>
              <p style={{ color: '#a67b5b', margin: 0 }}>критичных запасов</p>
            </div>
          </div>
        </div>

        {/* Две колонки */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Левая колонка - котики */}
          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            backdropFilter: 'blur(5px)',
            borderRadius: '30px',
            padding: '25px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '2px dashed #e6c9a8'
            }}>
              <h2 style={{ color: '#5a3e2b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🐱 Последние поступления
              </h2>
              <Link to="/cats" style={{ color: '#d2691e', textDecoration: 'none' }}>
        ВСЕ КОТИКИ →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recentCats.map(cat => (
                <div key={cat.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '15px'
                }}>
                  <span style={{ fontSize: '32px' }}>
                    {cat.color === 'рыжий' && '🦁'}
                    {cat.color === 'серая' && '🐭'}
                    {cat.color === 'белый' && '🐇'}
                    {cat.color === 'рыжая' && '🦊'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, color: '#5a3e2b' }}>{cat.name}</span>
                    <p style={{ fontSize: '12px', color: '#a67b5b', margin: '4px 0 0' }}>
                      {cat.personality}
                    </p>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '50px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: cat.status === 'in_cafe' ? '#e6c9a8' : 
                               cat.status === 'reserved' ? '#fff3cd' : '#d4edda',
                    color: cat.status === 'in_cafe' ? '#5a3e2b' : 
                           cat.status === 'reserved' ? '#856404' : '#155724'
                  }}>
                    {cat.status === 'in_cafe' && 'В кафе'}
                    {cat.status === 'reserved' && 'Забронирован'}
                    {cat.status === 'adopted' && 'Пристроен'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Правая колонка - запасы */}
          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            backdropFilter: 'blur(5px)',
            borderRadius: '30px',
            padding: '25px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '2px dashed #e6c9a8'
            }}>
              <h2 style={{ color: '#5a3e2b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                ⚠️ Требует внимания
              </h2>
              <Link to="/inventory" style={{ color: '#d2691e', textDecoration: 'none' }}>
                ВЕСЬ СКЛАД →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {lowStock.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '15px',
                  borderLeft: `5px solid ${getStockStatusColor(item.stock, item.minQuantity)}`
                }}>
                  <span style={{ fontSize: '24px' }}>{getCategoryIcon(item.category)}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, color: '#5a3e2b' }}>{item.name}</span>
                    <p style={{ fontSize: '12px', color: '#a67b5b', margin: '4px 0 0' }}>
                      Осталось: {item.stock} {item.unit} (мин. {item.minQuantity} {item.unit})
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '50px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: getStockStatusColor(item.stock, item.minQuantity),
                    color: 'white'
                  }}>
                    {item.stock <= item.minQuantity * 0.5 ? 'Критично' : 'Мало'}
                  </span>
                </div>
              ))}
            </div>

            {/* Статистика команды */}
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(210, 105, 30, 0.1)',
              borderRadius: '15px',
              display: 'flex',
              justifyContent: 'space-around'
            }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '24px' }}>😺</span>
                <p style={{ fontWeight: 700, color: '#8b4513' }}>{stats.volunteers}</p>
                <p style={{ fontSize: '12px', color: '#a67b5b' }}>КОТИКИ!!!</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '24px' }}>☕</span>
                <p style={{ fontWeight: 700, color: '#8b4513' }}>{stats.baristas}</p>
                <p style={{ fontSize: '12px', color: '#a67b5b' }}>Дайте КОФЕ!!!</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '24px' }}>💼</span>
                <p style={{ fontWeight: 700, color: '#8b4513' }}>{stats.workers}</p>
                <p style={{ fontSize: '12px', color: '#a67b5b' }}>Work work work</p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки быстрого доступа */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <Link to="/products" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255, 248, 235, 0.9)',
              backdropFilter: 'blur(5px)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <span style={{ fontSize: '32px' }}>☕</span>
              <p style={{ color: '#5a3e2b', fontWeight: 600, marginTop: '10px' }}>Меню</p>
            </div>
          </Link>

          <Link to="/inventory" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255, 248, 235, 0.9)',
              backdropFilter: 'blur(5px)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <span style={{ fontSize: '32px' }}>📦</span>
              <p style={{ color: '#5a3e2b', fontWeight: 600, marginTop: '10px' }}>Склад</p>
            </div>
          </Link>

          <Link to="/cats" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255, 248, 235, 0.9)',
              backdropFilter: 'blur(5px)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <span style={{ fontSize: '32px' }}>🐱</span>
              <p style={{ color: '#5a3e2b', fontWeight: 600, marginTop: '10px' }}>Котики</p>
            </div>
          </Link>

          {isAdmin && (
            <Link to="/admin" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 248, 235, 0.9)',
                backdropFilter: 'blur(5px)',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <span style={{ fontSize: '32px' }}>⚙️</span>
                <p style={{ color: '#5a3e2b', fontWeight: 600, marginTop: '10px' }}>Админка</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Стили */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;