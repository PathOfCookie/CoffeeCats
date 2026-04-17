// src/services/cat.service.ts
import api from './api';
import { Cat } from '../types';

class CatService {
  async getAllCats(): Promise<Cat[]> {
    const response = await api.get('/cats');
    return response.data;
  }

  async getCatById(id: string): Promise<Cat> {
    const response = await api.get(`/cats/${id}`);
    return response.data;
  }

  async createCat(catData: Partial<Cat>): Promise<Cat> {
    const response = await api.post('/cats', catData);
    return response.data;
  }

  async updateCat(id: string, catData: Partial<Cat>): Promise<Cat> {
    const response = await api.patch(`/cats/${id}`, catData);
    return response.data;
  }

  async deleteCat(id: string): Promise<void> {
    await api.delete(`/cats/${id}`);
  }

  async getCatStats(): Promise<any> {
    const response = await api.get('/cats/stats');
    return response.data;
  }
}

export default new CatService();