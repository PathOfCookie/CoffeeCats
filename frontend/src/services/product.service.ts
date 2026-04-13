// src/services/product.service.ts
import { apiService } from './api';
import { Product, CreateProductData, UpdateProductData, ProductStats } from '../types';

class ProductService {
  // Получить все товары
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>('/products');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Получить товар по id
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiService.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Создать новый товар
  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const response = await apiService.post<Product>('/products', productData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Обновить товар
  async updateProduct(id: string, productData: UpdateProductData): Promise<Product> {
    try {
      const response = await apiService.patch<Product>(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Удалить товар
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiService.delete(`/products/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Получить статистику по товарам
  async getProductStats(): Promise<ProductStats> {
    try {
      const response = await apiService.get<ProductStats>('/products/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Проверить, достаточно ли товара
  isStockSufficient(product: Product): boolean {
    return product.stock >= product.minQuantity;
  }

  // Получить статус запаса
  getStockStatus(product: Product): 'critical' | 'low' | 'normal' | 'good' {
    if (product.stock <= product.minQuantity * 0.5) return 'critical';
    if (product.stock <= product.minQuantity) return 'low';
    if (product.stock <= product.minQuantity * 2) return 'normal';
    return 'good';
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data.message || 'Ошибка сервера');
    } else if (error.request) {
      return new Error('Нет ответа от сервера. Проверьте подключение.');
    } else {
      return new Error('Ошибка при отправке запроса');
    }
  }
}

export default new ProductService();