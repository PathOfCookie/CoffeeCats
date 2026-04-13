// src/pages/Products.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import productService from '../services/product.service';
import ProductForm from '../components/ProductForm';
import { Product, CreateProductData } from '../types';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  
  const { isAdmin, isBarista } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Фильтрация товаров
    let filtered = [...products];

    // Поиск по названию
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по категории
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Фильтр по наличию
    if (stockFilter === 'low') {
      filtered = filtered.filter(p => p.stock <= p.minQuantity);
    } else if (stockFilter === 'critical') {
      filtered = filtered.filter(p => p.stock <= p.minQuantity * 0.5);
    } else if (stockFilter === 'normal') {
      filtered = filtered.filter(p => p.stock > p.minQuantity);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data: CreateProductData) => {
    try {
      const newProduct = await productService.createProduct(data);
      setProducts([...products, newProduct]);
      setShowForm(false);
    } catch (err) {
      alert('Ошибка при добавлении товара');
    }
  };

  const handleUpdateProduct = async (data: CreateProductData) => {
    if (!editingProduct) return;
    
    try {
      const updatedProduct = await productService.updateProduct(editingProduct.id, data);
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setEditingProduct(null);
    } catch (err) {
      alert('Ошибка при обновлении товара');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!isAdmin) return;
    
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Ошибка при удалении товара');
      }
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.minQuantity * 0.5) return { text: '⚠️ Критично', color: '#dc3545' };
    if (product.stock <= product.minQuantity) return { text: '⚡ Мало', color: '#ffc107' };
    if (product.stock <= product.minQuantity * 2) return { text: '📊 Норма', color: '#17a2b8' };
    return { text: '✅ Много', color: '#28a745' };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coffee': return '☕';
      case 'tea': return '🫖';
      case 'food': return '🥐';
      case 'litter': return '🧻';
      case 'medicine': return '💊';
      default: return '📦';
    }
  };

  // Статистика
  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.stock <= p.minQuantity).length,
    criticalStock: products.filter(p => p.stock <= p.minQuantity * 0.5).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ fontSize: '48px', animation: 'spin 1s infinite' }}>📦</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Шапка */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#5a3e2b', fontSize: '36px' }}>
          📦 Управление товарами
        </h1>
        {(isAdmin || isBarista) && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #8b4513, #d2691e)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {showForm ? '✕ Закрыть' : '+ Добавить товар'}
          </button>
        )}
      </div>

      {/* Дашборд статистики */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(255, 248, 235, 0.9)',
          borderRadius: '20px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.total}</div>
          <div style={{ color: '#a67b5b' }}>Всего товаров</div>
        </div>

        <div style={{
          background: 'rgba(255, 248, 235, 0.9)',
          borderRadius: '20px',
          padding: '20px',
          textAlign: 'center',
          border: stats.lowStock > 0 ? '2px solid #ffc107' : 'none'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.lowStock}</div>
          <div style={{ color: '#a67b5b' }}>Мало (менее мин.)</div>
        </div>

        <div style={{
          background: 'rgba(255, 248, 235, 0.9)',
          borderRadius: '20px',
          padding: '20px',
          textAlign: 'center',
          border: stats.criticalStock > 0 ? '2px solid #dc3545' : 'none'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚠️</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.criticalStock}</div>
          <div style={{ color: '#a67b5b' }}>Критично</div>
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
      </div>

      {/* Форма добавления/редактирования */}
      {(showForm || editingProduct) && (
        <ProductForm
          initialData={editingProduct || undefined}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Фильтры и поиск */}
      <div style={{
        background: 'rgba(255, 248, 235, 0.9)',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '30px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="🔍 Поиск товаров..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 2,
            minWidth: '250px',
            padding: '12px',
            border: '2px solid #e6c9a8',
            borderRadius: '15px',
            fontSize: '16px'
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            flex: 1,
            minWidth: '150px',
            padding: '12px',
            border: '2px solid #e6c9a8',
            borderRadius: '15px',
            fontSize: '16px'
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
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          style={{
            flex: 1,
            minWidth: '150px',
            padding: '12px',
            border: '2px solid #e6c9a8',
            borderRadius: '15px',
            fontSize: '16px'
          }}
        >
          <option value="all">📊 Все запасы</option>
          <option value="low">⚡ Только мало</option>
          <option value="critical">⚠️ Только критично</option>
          <option value="normal">✅ В норме</option>
        </select>
      </div>

      {/* Список товаров */}
      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredProducts.map(product => {
          const status = getStockStatus(product);
          return (
            <div
              key={product.id}
              style={{
                background: 'rgba(255, 248, 235, 0.9)',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                borderLeft: `5px solid ${status.color}`
              }}
            >
              <div style={{ fontSize: '32px' }}>{getCategoryIcon(product.category)}</div>
              
              <div style={{ flex: 2 }}>
                <h3 style={{ color: '#5a3e2b', marginBottom: '5px' }}>{product.name}</h3>
                {product.description && (
                  <p style={{ color: '#a67b5b', fontSize: '14px' }}>{product.description}</p>
                )}
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#8b4513' }}>
                  {product.price} ₽
                </div>
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontWeight: 600, color: '#5a3e2b' }}>
                  {product.stock} {product.unit}
                </div>
                <div style={{ fontSize: '12px', color: '#a67b5b' }}>
                  мин. {product.minQuantity} {product.unit}
                </div>
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{
                  background: status.color,
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '50px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {status.text}
                </span>
              </div>

              {(isAdmin || isBarista) && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setEditingProduct(product)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
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
              )}
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#a67b5b' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
          <h3>Товары не найдены</h3>
          {(isAdmin || isBarista) && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: '#8b4513',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer'
              }}
            >
              Добавить первый товар
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;