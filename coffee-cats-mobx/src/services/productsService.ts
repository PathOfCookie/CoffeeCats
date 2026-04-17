// src/services/productsService.ts
import axios from 'axios';

const PRODUCTS_SERVICE_URL = process.env.REACT_APP_PRODUCTS_SERVICE_URL || 'http://localhost:3002';

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
    const response = await axios.get(`${PRODUCTS_SERVICE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateStock: async (id: string, stock: number, token: string): Promise<Product> => {
    const response = await axios.patch(
      `${PRODUCTS_SERVICE_URL}/products/${id}`,
      { stock },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};