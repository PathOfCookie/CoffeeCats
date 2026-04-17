// packages/mf-cats/src/CatsTable.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cat, User } from '@coffee-cats/shared';

interface CatsTableProps {
  user: User | null;
}

const CatsTable: React.FC<CatsTableProps> = ({ user }) => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3003/cats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCats(response.data);
    } catch (err) {
      // Мок-данные для демо
      setCats([
        { id: '1', name: 'Барсик', color: 'рыжий', age: 2, status: 'in_cafe', gender: 'male', breed: 'дворовый', personality: 'Ласковый', arrivalDate: '2026-04-01', arrivalType: 'found', medicalHistory: [] },
        { id: '2', name: 'Муся', color: 'серая', age: 1, status: 'in_cafe', gender: 'female', breed: 'британская', personality: 'Стеснительная', arrivalDate: '2026-04-05', arrivalType: 'from_owner', medicalHistory: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Cat['status']) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`http://localhost:3003/cats/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCats(cats.map(c => c.id === id ? { ...c, status } : c));
    } catch (err) {
      console.error('Ошибка обновления статуса');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_cafe': return '#17a2b8';
      case 'reserved': return '#ffc107';
      case 'adopted': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>🐱 Загрузка котиков...</div>;

  return (
    <div>
      <h2 style={{ color: '#5a3e2b', marginBottom: '20px' }}>🐱 Наши котики</h2>
      <div style={{ background: 'rgba(255,248,235,0.9)', borderRadius: '20px', padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#8b4513', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Имя</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Окрас</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Возраст</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #e6c9a8' }}>
                <td style={{ padding: '12px' }}>{cat.name}</td>
                <td style={{ padding: '12px' }}>{cat.color}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{cat.age} лет</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {user?.role === 'admin' ? (
                    <select
                      value={cat.status}
                      onChange={(e) => updateStatus(cat.id, e.target.value as Cat['status'])}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '20px',
                        background: getStatusColor(cat.status),
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="in_cafe">В кафе</option>
                      <option value="reserved">Забронирован</option>
                      <option value="adopted">Пристроен</option>
                    </select>
                  ) : (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: getStatusColor(cat.status),
                      color: 'white'
                    }}>
                      {cat.status === 'in_cafe' && 'В кафе'}
                      {cat.status === 'reserved' && 'Забронирован'}
                      {cat.status === 'adopted' && 'Пристроен'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatsTable;