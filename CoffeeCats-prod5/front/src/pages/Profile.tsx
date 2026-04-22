// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useStores } from '../context/MobXContext';

const Profile: React.FC = observer(() => {
  const { auth, products, cats } = useStores();
  const [nameInput, setNameInput] = useState(auth.user?.name ?? '');

  useEffect(() => {
    // Данные возьмутся из кэша, если они уже загружены
    products.fetchProducts();
    cats.fetchCats();
  }, [products, cats]);

  useEffect(() => {
    setNameInput(auth.user?.name ?? '');
  }, [auth.user?.name]);

  const handleNameSave = () => {
    auth.updateUserName(nameInput);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Профиль пользователя</h1>
      <p>Имя: {auth.user?.name}</p>
      <p>Email: {auth.user?.email}</p>
      <p>Роль: {auth.user?.role}</p>

      <h3>Редактирование имени (MobX demo)</h3>
      <div style={{ display: 'flex', gap: '10px', maxWidth: '420px', marginBottom: '16px' }}>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Введите новое имя"
          style={{ flex: 1, padding: '8px 12px' }}
        />
        <button onClick={handleNameSave} style={{ padding: '8px 14px' }}>
          Сохранить
        </button>
      </div>
      <p style={{ color: '#6b4c35' }}>
        После сохранения имя сразу обновится на главной странице.
      </p>
      
      <h3>📊 Статистика (данные из кэша)</h3>
      <p>Всего товаров: {products.items.length}</p>
      <p>Котиков в кафе: {cats.catsInCafe.length}</p>

      <Link to="/dashboard">← Вернуться на главную</Link>
    </div>
  );
});

export default Profile;