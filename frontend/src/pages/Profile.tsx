import React from 'react';
import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../store/api/productsApi';
import { useGetCatsQuery } from '../store/api/catsApi';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // 🔄 Данные из кэша! Не делают новый запрос, если уже загружены
  const { data: products } = useGetProductsQuery();
  const { data: cats } = useGetCatsQuery();

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>Имя: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Роль: {user?.role}</p>
      
      <h3>📊 Статистика (данные из кэша)</h3>
      <p>Всего товаров: {products?.length || 0}</p>
      <p>Котиков в кафе: {cats?.filter(c => c.status === 'in_cafe').length || 0}</p>
    </div>
  );
};