import React from 'react';
import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../store/api/productsApi';
import { useGetCatsQuery } from '../store/api/catsApi';
import { RootState } from '../store';

// Определим тип локально
interface Cat {
  id: string;
  name: string;
  status: 'in_cafe' | 'reserved' | 'adopted';
  // ... другие поля
}

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { data: products } = useGetProductsQuery(undefined);
  const { data: cats } = useGetCatsQuery(undefined);

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>Имя: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Роль: {user?.role}</p>
      
      <h3>📊 Статистика (данные из кэша)</h3>
      <p>Всего товаров: {products?.length || 0}</p>
      <p>Котиков в кафе: {cats?.filter((cat: Cat) => cat.status === 'in_cafe').length || 0}</p>
    </div>
  );
};

export default Profile;