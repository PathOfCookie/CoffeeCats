// src/services/product.service.ts
import api from './api';
import { Product } from '../types';

class ProductService {
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await api.post('/products', productData);
    return response.data;
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }

  async getProductStats(): Promise<any> {
    const response = await api.get('/products/stats');
    return response.data;
  }
}

export default new ProductService();