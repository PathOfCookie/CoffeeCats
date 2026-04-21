// pages/Profile.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../context/MobXContext';

const Profile = observer(() => {
  const { auth } = useStores();
  const [newName, setNewName] = useState(auth.user?.name || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateName = async () => {
    if (newName.trim()) {
      await auth.updateUserName(newName.trim());
      setIsEditing(false);
    }
  };

  if (!auth.user) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>👤 Профиль пользователя</h1>
      
      <div style={{ marginBottom: '20px', padding: '20px', background: '#f5f0e8', borderRadius: '10px' }}>
        <h3>Информация</h3>
        <p><strong>Email:</strong> {auth.user.email}</p>
        <p><strong>Роль:</strong> {auth.user.role}</p>
        
        <div style={{ marginTop: '15px' }}>
          <strong>Имя:</strong>
          {isEditing ? (
            <div style={{ marginTop: '5px' }}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ padding: '8px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <button onClick={handleUpdateName} style={{ padding: '8px 15px', marginRight: '5px', cursor: 'pointer' }}>
                💾 Сохранить
              </button>
              <button onClick={() => setIsEditing(false)} style={{ padding: '8px 15px', cursor: 'pointer' }}>
                ❌ Отмена
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '5px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{auth.user.name}</span>
              <button onClick={() => setIsEditing(true)} style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}>
                ✏️ Редактировать
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ background: '#e8f4e8', padding: '15px', borderRadius: '10px' }}>
        <h3>🔄 Демонстрация MobX</h3>
        <p>Измени имя на этой странице — оно автоматически обновится на главной странице!</p>
        <p><strong>Текущее имя в сторе:</strong> {auth.user.name}</p>
      </div>
    </div>
  );
});

export default Profile;