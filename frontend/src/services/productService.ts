// src/services/productsService.ts
import axios from 'axios';

// Прямое подключение к микросервису товаров
const PRODUCTS_SERVICE_URL = process.env.REACT_APP_PRODUCTS_SERVICE_URL || '';

const productsApi = axios.create({
  baseURL: PRODUCTS_SERVICE_URL,
  headers: { 'Content-Type': 'application/json' },
});

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
  // Получить все товары
  getAll: async (token: string): Promise<Product[]> => {
    const response = await productsApi.get('/products', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Получить товар по ID
  getById: async (id: string, token: string): Promise<Product> => {
    const response = await productsApi.get(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Создать товар (только admin)
  create: async (data: Partial<Product>, token: string): Promise<Product> => {
    const response = await productsApi.post('/products', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Обновить товар
  update: async (id: string, data: Partial<Product>, token: string): Promise<Product> => {
    const response = await productsApi.patch(`/products/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Удалить товар (только admin)
  delete: async (id: string, token: string): Promise<void> => {
    await productsApi.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};