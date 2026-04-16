// src/pages/Inventory.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Product } from '../types';

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  
  const { isAdmin } = useAuth();

  // Загрузка данных с бэкенда
  useEffect(() => {
    fetchInventory();
  }, []);

  // Фильтрация и сортировка
  useEffect(() => {
    let filtered = [...inventory];

    // Поиск по названию
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по категории
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        const status = getStockStatus(item);
        return status.type === statusFilter;
      });
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock-asc':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [inventory, searchTerm, categoryFilter, statusFilter, sortBy]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get<Product[]>('/products');
      setInventory(response.data);
    } catch (err) {
      console.error('Ошибка загрузки склада:', err);
      setError('Не удалось загрузить данные склада');
    } finally {
      setLoading(false);
    }
  };

  // Обновление количества
  const handleUpdateStock = async (id: string, newStock: number) => {
    if (!isAdmin) return;
    
    try {
      const response = await api.patch<Product>(`/products/${id}`, { stock: newStock });
      setInventory(prev =>
        prev.map(item =>
          item.id === id ? response.data : item
        )
      );
    } catch (err) {
      console.error('Ошибка обновления количества:', err);
      alert('Не удалось обновить количество товара');
    }
  };

  // Удаление товара
  const handleDeleteItem = async (id: string) => {
    if (!isAdmin) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      await api.delete(`/products/${id}`);
      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Ошибка удаления товара:', err);
      alert('Не удалось удалить товар');
    }
  };

  // Получение статуса запаса
  const getStockStatus = (item: Product): { text: string; type: string; color: string } => {
    if (item.stock <= item.minQuantity * 0.5) {
      return { text: '⚠️ Критично', type: 'critical', color: '#dc3545' };
    }
    if (item.stock <= item.minQuantity) {
      return { text: '⚡ Мало', type: 'low', color: '#ffc107' };
    }
    if (item.stock <= item.minQuantity * 2) {
      return { text: '📊 Норма', type: 'normal', color: '#17a2b8' };
    }
    return { text: '✅ Много', type: 'good', color: '#28a745' };
  };

  // Получение иконки категории
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'coffee': return '☕';
      case 'tea': return '🫖';
      case 'food': return '🥐';
      case 'litter': return '🧻';
      case 'medicine': return '💊';
      default: return '📦';
    }
  };

  // Получение названия категории
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'coffee': return 'Кофе';
      case 'tea': return 'Чай';
      case 'food': return 'Еда';
      case 'litter': return 'Для котиков';
      case 'medicine': return 'Лекарства';
      default: return 'Другое';
    }
  };

  // Статистика
  const stats = {
    total: inventory.length,
    totalStock: inventory.reduce((sum, item) => sum + item.stock, 0),
    totalValue: inventory.reduce((sum, item) => sum + (item.price * item.stock), 0),
    critical: inventory.filter(item => item.stock <= item.minQuantity * 0.5).length,
    low: inventory.filter(item => item.stock <= item.minQuantity && item.stock > item.minQuantity * 0.5).length,
    normal: inventory.filter(item => item.stock > item.minQuantity && item.stock <= item.minQuantity * 2).length,
    good: inventory.filter(item => item.stock > item.minQuantity * 2).length,
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #fae5d7 0%, #e6d5b8 100%)'
      }}>
        <div style={{ fontSize: '48px', animation: 'spin 1s infinite' }}>📦</div>
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
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '36px', 
              color: '#5a3e2b',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span style={{ fontSize: '48px' }}>📦</span>
              Склад кофейни
            </h1>
            <p style={{ color: '#8b6b4f', marginTop: '5px' }}>
              Обновлено: {new Date().toLocaleString('ru-RU')}
            </p>
          </div>

          {isAdmin && (
            <button
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8b4513, #d2691e)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span>📊</span>
              Экспорт отчёта
            </button>
          )}
        </div>

        {/* Дашборд статистики */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.total}</div>
            <div style={{ color: '#a67b5b' }}>Всего позиций</div>
          </div>

          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>
              {stats.totalValue.toLocaleString()} ₽
            </div>
            <div style={{ color: '#a67b5b' }}>Общая стоимость</div>
          </div>

          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            border: stats.critical > 0 ? '2px solid #dc3545' : 'none'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚠️</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.critical}</div>
            <div style={{ color: '#a67b5b' }}>Критичный запас</div>
          </div>

          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            border: stats.low > 0 ? '2px solid #ffc107' : 'none'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.low}</div>
            <div style={{ color: '#a67b5b' }}>Мало</div>
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Фильтры */}
        <div style={{
          background: 'rgba(255, 248, 235, 0.9)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          backdropFilter: 'blur(5px)'
        }}>
          <input
            type="text"
            placeholder="🔍 Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #e6c9a8',
              borderRadius: '15px',
              fontSize: '14px',
              outline: 'none'
            }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #e6c9a8',
              borderRadius: '15px',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            <option value="all">📋 Все категории</option>
            <option value="coffee">☕ Кофе</option>
            <option value="tea">🫖 Чай</option>
            <option value="food">🥐 Еда</option>
            <option value="litter">🧻 Для котиков</option>
            <option value="medicine">💊 Лекарства</option>
            <option value="other">📦 Другое</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #e6c9a8',
              borderRadius: '15px',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            <option value="all">📊 Все статусы</option>
            <option value="critical">⚠️ Критично</option>
            <option value="low">⚡ Мало</option>
            <option value="normal">📊 Норма</option>
            <option value="good">✅ Много</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #e6c9a8',
              borderRadius: '15px',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            <option value="name">📝 По названию</option>
            <option value="stock-asc">⬆️ По возрастанию остатка</option>
            <option value="stock-desc">⬇️ По убыванию остатка</option>
            <option value="category">📋 По категории</option>
          </select>
        </div>

        {/* Таблица склада */}
        <div style={{
          background: 'rgba(255, 248, 235, 0.9)',
          borderRadius: '30px',
          padding: '20px',
          backdropFilter: 'blur(5px)',
          overflowX: 'auto'
        }}>
          {/* Заголовок таблицы */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '50px 2fr 1fr 1fr 1fr 100px 80px',
            gap: '15px',
            padding: '15px',
            background: 'rgba(139, 69, 19, 0.1)',
            borderRadius: '15px',
            fontWeight: 700,
            color: '#5a3e2b',
            marginBottom: '10px'
          }}>
            <div></div>
            <div>Товар</div>
            <div>Категория</div>
            <div>Количество</div>
            <div>Мин. запас</div>
            <div>Статус</div>
            <div></div>
          </div>

          {/* Строки таблицы */}
          {filteredItems.map(item => {
            const status = getStockStatus(item);
            return (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 2fr 1fr 1fr 1fr 100px 80px',
                  gap: '15px',
                  padding: '15px',
                  borderBottom: '1px solid #e6c9a8',
                  alignItems: 'center',
                  background: 'white',
                  borderRadius: '10px',
                  marginBottom: '5px',
                  borderLeft: `5px solid ${status.color}`
                }}
              >
                <div style={{ fontSize: '24px', textAlign: 'center' }}>
                  {getCategoryIcon(item.category)}
                </div>

                <div>
                  <div style={{ fontWeight: 600, color: '#5a3e2b' }}>{item.name}</div>
                  {item.description && (
                    <div style={{ fontSize: '12px', color: '#a67b5b' }}>{item.description}</div>
                  )}
                </div>

                <div style={{ color: '#7b5f47' }}>
                  {getCategoryName(item.category)}
                </div>

                <div>
                  {isAdmin ? (
                    <input
                      type="number"
                      value={item.stock}
                      onChange={(e) => handleUpdateStock(item.id, parseFloat(e.target.value))}
                      min="0"
                      step="0.1"
                      style={{
                        width: '80px',
                        padding: '6px',
                        border: '2px solid #e6c9a8',
                        borderRadius: '10px',
                        textAlign: 'center'
                      }}
                    />
                  ) : (
                    <span style={{ fontWeight: 600 }}>
                      {item.stock} {item.unit}
                    </span>
                  )}
                </div>

                <div style={{ color: '#7b5f47' }}>
                  {item.minQuantity} {item.unit}
                </div>

                <div>
                  <span style={{
                    background: status.color,
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '50px',
                    fontSize: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}>
                    {status.text}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                    title="История изменений"
                  >
                    📊
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '5px',
                        color: '#dc3545'
                      }}
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && !error && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#a67b5b' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
              <h3>Товары не найдены</h3>
              <p>Попробуйте изменить параметры фильтрации</p>
            </div>
          )}
        </div>

        {/* Итоги */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
          background: 'rgba(255, 248, 235, 0.7)',
          borderRadius: '15px',
          color: '#5a3e2b'
        }}>
          <div>
            Показано: <strong>{filteredItems.length}</strong> из <strong>{inventory.length}</strong> товаров
          </div>
          <div>
            Общий остаток: <strong>{stats.totalStock.toFixed(1)}</strong> единиц
          </div>
        </div>
      </div>

      {/* Стили для анимации */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Inventory;