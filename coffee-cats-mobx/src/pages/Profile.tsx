// src/pages/Profile.tsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../context/MobXContext';

const Profile: React.FC = observer(() => {
  const { auth, products, cats } = useStores();

  useEffect(() => {
    // Данные возьмутся из кэша, если они уже загружены
    products.fetchProducts();
    cats.fetchCats();
  }, []);

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>Имя: {auth.user?.name}</p>
      <p>Email: {auth.user?.email}</p>
      <p>Роль: {auth.user?.role}</p>
      
      <h3>📊 Статистика (данные из кэша)</h3>
      <p>Всего товаров: {products.items.length}</p>
      <p>Котиков в кафе: {cats.catsInCafe.length}</p>
    </div>
  );
});

export default Profile;