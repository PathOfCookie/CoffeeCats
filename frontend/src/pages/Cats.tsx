// src/pages/Cats.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Cat, MedicalRecord } from '../types';

// Тип для потенциального усыновителя (временно, пока не добавили в types)
interface PotentialAdopter {
  id: string;
  catId: string;
  name: string;
  phone: string;
  email: string;
  status: 'interested' | 'meeting_scheduled' | 'approved' | 'rejected';
  meetingDate?: string;
  notes: string;
  createdAt: string;
}

const Cats: React.FC = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [adopters, setAdopters] = useState<PotentialAdopter[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdopterForm, setShowAdopterForm] = useState(false);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'cats' | 'adopters'>('cats');
  
  const { isAdmin, isVolunteer } = useAuth();

  // Загрузка данных с бэкенда
  useEffect(() => {
    fetchCats();
    fetchAdopters();
  }, []);

  // Фильтрация котиков
  useEffect(() => {
    let filtered = [...cats];

    if (searchTerm) {
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.personality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(cat => cat.status === filterStatus);
    }

    setFilteredCats(filtered);
  }, [cats, searchTerm, filterStatus]);

  const fetchCats = async () => {
    try {
      setLoading(true);
      const response = await api.get<Cat[]>('/cats');
      setCats(response.data);
    } catch (err) {
      console.error('Ошибка загрузки котиков:', err);
      setError('Не удалось загрузить список котиков');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdopters = async () => {
    try {
      const response = await api.get<PotentialAdopter[]>('/adoptions');
      setAdopters(response.data);
    } catch (err) {
      console.error('Ошибка загрузки кандидатов:', err);
    }
  };

  const handleAddCat = async (catData: Partial<Cat>) => {
    try {
      const response = await api.post<Cat>('/cats', catData);
      setCats([...cats, response.data]);
      setShowAddForm(false);
    } catch (err) {
      console.error('Ошибка добавления котика:', err);
      alert('Не удалось добавить котика');
    }
  };

  const handleUpdateCat = async (id: string, catData: Partial<Cat>) => {
    try {
      const response = await api.patch<Cat>(`/cats/${id}`, catData);
      setCats(cats.map(cat => cat.id === id ? response.data : cat));
      setSelectedCat(null);
    } catch (err) {
      console.error('Ошибка обновления котика:', err);
      alert('Не удалось обновить данные котика');
    }
  };

  const handleDeleteCat = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm('Вы уверены, что хотите удалить этого котика?')) return;

    try {
      await api.delete(`/cats/${id}`);
      setCats(cats.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Ошибка удаления котика:', err);
      alert('Не удалось удалить котика');
    }
  };

  const handleAddMedicalRecord = async (catId: string, record: MedicalRecord) => {
    try {
      const response = await api.post<Cat>(`/cats/${catId}/medical`, record);
      setCats(cats.map(cat => cat.id === catId ? response.data : cat));
      setShowMedicalForm(false);
    } catch (err) {
      console.error('Ошибка добавления медицинской записи:', err);
      alert('Не удалось добавить запись');
    }
  };

  // Статистика
  const stats = {
    total: cats.length,
    inCafe: cats.filter(c => c.status === 'in_cafe').length,
    reserved: cats.filter(c => c.status === 'reserved').length,
    adopted: cats.filter(c => c.status === 'adopted').length,
    needVaccination: cats.filter(c => 
      c.medicalHistory?.some(m => m.nextDate && new Date(m.nextDate) <= new Date())
    ).length,
    pendingAdopters: adopters.filter(a => a.status === 'interested' || a.status === 'meeting_scheduled').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_cafe':
        return { text: '🐱 В кафе', color: '#17a2b8' };
      case 'reserved':
        return { text: '📅 Забронирован', color: '#ffc107' };
      case 'adopted':
        return { text: '🏠 Пристроен', color: '#28a745' };
      default:
        return { text: status, color: '#6c757d' };
    }
  };

  const getAdopterStatusBadge = (status: string) => {
    switch (status) {
      case 'interested':
        return { text: '❓ Интересуется', color: '#17a2b8' };
      case 'meeting_scheduled':
        return { text: '📅 Назначена встреча', color: '#ffc107' };
      case 'approved':
        return { text: '✅ Одобрено', color: '#28a745' };
      case 'rejected':
        return { text: '❌ Отказ', color: '#dc3545' };
      default:
        return { text: status, color: '#6c757d' };
    }
  };

  const getArrivalTypeText = (type: string) => {
    switch (type) {
      case 'found': return '🐾 Найден на улице';
      case 'from_shelter': return '🏠 Из приюта';
      case 'from_owner': return '👨‍👩‍👧 От хозяев';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
              <span style={{ fontSize: '48px' }}>🐱</span>
              Наши хвостики
            </h1>
            <p style={{ color: '#8b6b4f', marginTop: '5px' }}>
              Забота и любовь к каждому котику ❤️
            </p>
          </div>

          {(isAdmin || isVolunteer) && (
            <button
              onClick={() => setShowAddForm(true)}
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
              <span>🐾</span>
              Добавить котика
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
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🐱</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.total}</div>
            <div style={{ color: '#a67b5b' }}>Всего котиков</div>
          </div>

          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏠</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.adopted}</div>
            <div style={{ color: '#a67b5b' }}>Нашли дом</div>
          </div>

          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📅</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.reserved}</div>
            <div style={{ color: '#a67b5b' }}>Забронированы</div>
          </div>

          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            border: stats.needVaccination > 0 ? '2px solid #ffc107' : 'none'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💉</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.needVaccination}</div>
            <div style={{ color: '#a67b5b' }}>Нужна прививка</div>
          </div>

          <div style={{
            background: 'rgba(255, 248, 235, 0.9)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            border: stats.pendingAdopters > 0 ? '2px solid #17a2b8' : 'none'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#8b4513' }}>{stats.pendingAdopters}</div>
            <div style={{ color: '#a67b5b' }}>Потенциальных хозяев</div>
          </div>
        </div>

        {/* Вкладки */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          background: 'rgba(255, 248, 235, 0.7)',
          padding: '10px',
          borderRadius: '60px',
          maxWidth: '400px'
        }}>
          <button
            onClick={() => setActiveTab('cats')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '50px',
              background: activeTab === 'cats' ? 'linear-gradient(135deg, #8b4513, #d2691e)' : 'transparent',
              color: activeTab === 'cats' ? 'white' : '#5a3e2b',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🐱 Котики
          </button>
          <button
            onClick={() => setActiveTab('adopters')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '50px',
              background: activeTab === 'adopters' ? 'linear-gradient(135deg, #8b4513, #d2691e)' : 'transparent',
              color: activeTab === 'adopters' ? 'white' : '#5a3e2b',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            👥 Потенциальные хозяева
          </button>
        </div>

        {activeTab === 'cats' ? (
          <>
            {/* Фильтры для котиков */}
            <div style={{
              background: 'rgba(255, 248, 235, 0.9)',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '30px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              <input
                type="text"
                placeholder="🔍 Поиск по имени, окрасу, характеру..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '12px',
                  border: '2px solid #e6c9a8',
                  borderRadius: '15px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="all">📋 Все статусы</option>
                <option value="in_cafe">🐱 В кафе</option>
                <option value="reserved">📅 Забронированы</option>
                <option value="adopted">🏠 Пристроены</option>
              </select>
            </div>

            {/* Сетка котиков */}
            {error && (
              <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {filteredCats.map(cat => {
                const status = getStatusBadge(cat.status);
                const lastMedical = cat.medicalHistory?.[cat.medicalHistory.length - 1];
                
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCat(cat)}
                    style={{
                      background: 'rgba(255, 248, 235, 0.95)',
                      borderRadius: '30px',
                      padding: '25px',
                      cursor: 'pointer',
                      border: `2px solid ${status.color}`,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(139, 69, 19, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Аватар и статус */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '48px' }}>
                          {cat.gender === 'male' ? '🐈' : '🐈⬛'}
                        </span>
                        <div>
                          <h3 style={{ fontSize: '22px', color: '#5a3e2b', margin: 0 }}>{cat.name}</h3>
                          <p style={{ color: '#a67b5b', fontSize: '14px', margin: '5px 0 0' }}>
                            {cat.age} {cat.age === 1 ? 'год' : cat.age < 5 ? 'года' : 'лет'}, {cat.color}
                          </p>
                        </div>
                      </div>
                      <span style={{
                        background: status.color,
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {status.text}
                      </span>
                    </div>

                    {/* Характер */}
                    <p style={{ color: '#7b5f47', fontSize: '14px', marginBottom: '15px', fontStyle: 'italic' }}>
                      💭 {cat.personality}
                    </p>

                    {/* Информация о появлении */}
                    <div style={{
                      background: 'rgba(210, 105, 30, 0.05)',
                      padding: '12px',
                      borderRadius: '15px',
                      marginBottom: '15px',
                      fontSize: '13px'
                    }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                        <span>{getArrivalTypeText(cat.arrivalType)}</span>
                        <span style={{ color: '#a67b5b' }}>📅 {new Date(cat.arrivalDate).toLocaleDateString('ru-RU')}</span>
                      </div>
                      {cat.finderName && (
                        <div style={{ color: '#8b4513', marginTop: '5px' }}>
                          🙋 Нашёл(ла): {cat.finderName} {cat.finderPhone && `(${cat.finderPhone})`}
                        </div>
                      )}
                    </div>

                    {/* Медицинская информация */}
                    <div style={{
                      borderTop: '1px solid #e6c9a8',
                      paddingTop: '15px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 600, color: '#5a3e2b' }}>💉 Последние процедуры:</span>
                        <span style={{ fontSize: '12px', color: '#a67b5b' }}>
                          {cat.medicalHistory?.length || 0} записей
                        </span>
                      </div>
                      
                      {lastMedical && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.5)',
                          padding: '10px',
                          borderRadius: '10px',
                          fontSize: '13px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                              {lastMedical.type === 'vaccination' && '💉 Вакцинация'}
                              {lastMedical.type === 'treatment' && '💊 Лечение'}
                              {lastMedical.type === 'checkup' && '🔍 Осмотр'}
                              {lastMedical.type === 'surgery' && '🏥 Операция'}
                            </span>
                            <span style={{ color: '#a67b5b' }}>{new Date(lastMedical.date).toLocaleDateString('ru-RU')}</span>
                          </div>
                          <p style={{ margin: '5px 0 0', color: '#7b5f47' }}>{lastMedical.description}</p>
                          {lastMedical.nextDate && (
                            <div style={{ marginTop: '5px', color: '#d2691e', fontSize: '12px' }}>
                              ⏰ Следующая: {new Date(lastMedical.nextDate).toLocaleDateString('ru-RU')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Если котик пристроен */}
                    {cat.status === 'adopted' && (
                      <div style={{
                        marginTop: '15px',
                        padding: '12px',
                        background: '#d4edda',
                        borderRadius: '15px',
                        fontSize: '13px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                          <span>🏠</span>
                          <span style={{ fontWeight: 600 }}>Новый дом: {cat.newHome}</span>
                        </div>
                        <div style={{ color: '#155724' }}>
                          Контакт: {cat.newOwnerName} {cat.newOwnerPhone && `(${cat.newOwnerPhone})`}
                        </div>
                      </div>
                    )}

                    {/* Кнопки действий (если админ) */}
                    {isAdmin && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        display: 'flex',
                        gap: '5px'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCat(cat);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCat(cat.id);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#dc3545'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredCats.length === 0 && !error && (
              <div style={{ textAlign: 'center', padding: '50px', color: '#a67b5b' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>😿</div>
                <h3>Котики не найдены</h3>
                {(isAdmin || isVolunteer) && (
                  <button
                    onClick={() => setShowAddForm(true)}
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
                    Добавить первого котика
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Секция потенциальных хозяев */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#5a3e2b' }}>👥 Люди, желающие приютить котика</h2>
              {(isAdmin || isVolunteer) && (
                <button
                  onClick={() => setShowAdopterForm(true)}
                  style={{
                    padding: '10px 20px',
                    background: '#8b4513',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer'
                  }}
                >
                  + Записать кандидата
                </button>
              )}
            </div>

            <div style={{
              display: 'grid',
              gap: '15px'
            }}>
              {adopters.map(adopter => {
                const cat = cats.find(c => c.id === adopter.catId);
                const status = getAdopterStatusBadge(adopter.status);
                
                return (
                  <div
                    key={adopter.id}
                    style={{
                      background: 'rgba(255, 248, 235, 0.95)',
                      borderRadius: '20px',
                      padding: '20px',
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: '20px',
                      alignItems: 'center',
                      borderLeft: `5px solid ${status.color}`
                    }}
                  >
                    <div style={{ fontSize: '32px' }}>
                      {adopter.status === 'interested' && '❓'}
                      {adopter.status === 'meeting_scheduled' && '📅'}
                      {adopter.status === 'approved' && '✅'}
                      {adopter.status === 'rejected' && '❌'}
                    </div>

                    <div>
                      <h3 style={{ color: '#5a3e2b', marginBottom: '5px' }}>
                        {adopter.name}
                      </h3>
                      <p style={{ color: '#7b5f47', fontSize: '14px', marginBottom: '10px' }}>
                        Хочет приютить: <strong>{cat?.name || 'котика'}</strong>
                      </p>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#a67b5b' }}>
                        <span>📞 {adopter.phone}</span>
                        <span>✉️ {adopter.email}</span>
                      </div>
                      {adopter.meetingDate && (
                        <div style={{ marginTop: '10px', color: '#d2691e', fontSize: '13px' }}>
                          📅 Встреча назначена на {new Date(adopter.meetingDate).toLocaleDateString('ru-RU')}
                        </div>
                      )}
                      <p style={{ marginTop: '10px', fontSize: '14px', background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '10px' }}>
                        📝 {adopter.notes}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{
                        background: status.color,
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}>
                        {status.text}
                      </span>
                      <span style={{ fontSize: '12px', color: '#a67b5b', textAlign: 'center' }}>
                        от {new Date(adopter.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
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

export default Cats;