// src/components/ProductForm.tsx
import React, { useState } from 'react';
import { CreateProductData, ProductCategory, Unit } from '../store';

interface ProductFormProps {
  initialData?: Partial<CreateProductData>;
  onSubmit: (data: CreateProductData) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateProductData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || 'coffee',
    stock: initialData?.stock || 0,
    unit: initialData?.unit || 'шт',
    minQuantity: initialData?.minQuantity || 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{
      background: 'rgba(255, 248, 235, 0.95)',
      borderRadius: '30px',
      padding: '30px',
      marginBottom: '30px',
      border: '2px solid #e6c9a8'
    }}>
      <h3 style={{ color: '#5a3e2b', marginBottom: '20px', fontSize: '24px' }}>
        {initialData?.name ? '✏️ Редактировать товар' : '➕ Добавить новый товар'}
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Название */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#5a3e2b', fontWeight: 600 }}>
              Название товара
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Например: Капучино"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e6c9a8',
                borderRadius: '15px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Категория */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#5a3e2b', fontWeight: 600 }}>
              Категория
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e6c9a8',
                borderRadius: '15px',
                fontSize: '16px'
              }}
            >
              <option value="coffee">☕ Кофе</option>
              <option value="tea">🫖 Чай</option>
              <option value="food">🥐 Еда</option>
              <option value="litter">🧻 Для котиков</option>
              <option value="medicine">💊 Лекарства</option>
              <option value="other">📦 Другое</option>
            </select>
          </div>

          {/* Цена */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#5a3e2b', fontWeight: 600 }}>
              Цена (₽)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="1"
              placeholder="250"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e6c9a8',
                borderRadius: '15px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Количество */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#5a3e2b', fontWeight: 600 }}>
              В наличии
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
              placeholder="10"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e6c9a8',
                borderRadius: '15px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Минимальное количество */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#5a3e2b', fontWeight: 600 }}>
              Мин. запас
            </label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              required
              min="1"
              step="0.1"
              placeholder="2"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e6c9a8',
                borderRadius: '15px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Единица измерения */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#5a3e2b', fontWeight: 600 }}>
              Единица измерения
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e6c9a8',
                borderRadius: '15px',
                fontSize: '16px'
              }}
            >
              <option value="шт">штуки</option>
              <option value="г">граммы</option>
              <option value="кг">килограммы</option>
              <option value="л">литры</option>
              <option value="мл">миллилитры</option>
            </select>
          </div>
        </div>

        {/* Описание */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#5a3e2b', fontWeight: 600 }}>
            Описание
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Краткое описание товара"
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e6c9a8',
              borderRadius: '15px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #8b4513, #d2691e)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {initialData?.name ? 'Сохранить изменения' : 'Добавить товар'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: '#f0f0f0',
              color: '#7b5f47',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;