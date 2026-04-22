// packages/mf-products/src/ProductsTable.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, User } from '@coffee-cats/shared';

interface ProductsTableProps {
  user: User | null;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3002/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      // Мок-данные для демо
      setProducts([
        { id: '1', name: 'Зерна эспрессо', price: 1200, stock: 5.2, unit: 'кг', minQuantity: 2, category: 'coffee' },
        { id: '2', name: 'Молоко 3.2%', price: 89, stock: 12, unit: 'л', minQuantity: 5, category: 'food' },
        { id: '3', name: 'Сироп карамельный', price: 350, stock: 0.8, unit: 'л', minQuantity: 1, category: 'coffee' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, stock: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`http://localhost:3002/products/${id}`, { stock }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.map(p => p.id === id ? { ...p, stock } : p));
    } catch (err) {
      console.error('Ошибка обновления');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>📦 Загрузка товаров...</div>;

  return (
    <div>
      <h2 style={{ color: '#5a3e2b', marginBottom: '20px' }}>📦 Управление товарами</h2>
      <div style={{ background: 'rgba(255,248,235,0.9)', borderRadius: '20px', padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#8b4513', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Название</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Цена</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Количество</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #e6c9a8' }}>
                <td style={{ padding: '12px' }}>{product.name}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{product.price} ₽</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => updateStock(product.id, parseFloat(e.target.value))}
                    style={{ width: '80px', padding: '5px', borderRadius: '10px', border: '1px solid #e6c9a8' }}
                    disabled={user?.role !== 'admin'}
                  />
                  <span style={{ marginLeft: '5px' }}>{product.unit}</span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    background: product.stock <= product.minQuantity ? '#ffc107' : '#28a745',
                    color: 'white'
                  }}>
                    {product.stock <= product.minQuantity ? '⚡ Мало' : '✅ Норма'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;