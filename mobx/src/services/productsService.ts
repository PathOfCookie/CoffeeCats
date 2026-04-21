// src/services/productsService.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost/api';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  unit: string;
  minQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export const productsService = {
  getAll: async (token: string): Promise<Product[]> => {
    try {
      const response = await axios.get(`${PRODUCTS_SERVICE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Защита от не-массива
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API вернул не массив:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      return []; // Возвращаем пустой массив при ошибке
    }
  },

  updateStock: async (id: string, stock: number, token: string): Promise<Product> => {
    const response = await axios.patch(
      `${API_URL}/products/${id}`,
      { stock },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
