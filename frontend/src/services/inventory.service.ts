// src/services/inventory.service.ts
import api from './api';
import { Product } from '../types';

class InventoryService {
  async getInventory(): Promise<Product[]> {
    const response = await api.get('/inventory');
    return response.data;
  }

  async updateStock(id: string, stock: number): Promise<Product> {
    const response = await api.patch(`/inventory/${id}`, { stock });
    return response.data;
  }

  async getAlerts(): Promise<Product[]> {
    const response = await api.get('/inventory/alerts');
    return response.data;
  }
}

export default new InventoryService();