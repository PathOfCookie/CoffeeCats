// src/services/productsService.ts
import axios from 'axios';
import { MAIN_SERVICE_URL } from './apiConfig';

interface BackendProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  unit: string;
  min_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
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

const mapProduct = (product: BackendProduct): Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: Number(product.price),
  category: product.category,
  stock: Number(product.stock),
  unit: product.unit,
  minQuantity: Number(product.min_quantity),
  createdAt: product.created_at,
  updatedAt: product.updated_at,
});

export const productsService = {
  getAll: async (token: string): Promise<Product[]> => {
    const response = await axios.get<BackendProduct[]>(`${MAIN_SERVICE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map(mapProduct);
  },

  updateStock: async (id: number, stock: number, token: string): Promise<Product> => {
    const response = await axios.patch<BackendProduct>(
      `${MAIN_SERVICE_URL}/products/${id}`,
      { stock },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return mapProduct(response.data);
  },
};