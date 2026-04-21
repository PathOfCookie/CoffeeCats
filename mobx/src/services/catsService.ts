// src/services/catsService.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost/api';

export interface Cat {
  id: string;
  name: string;
  age: number;
  color: string;
  gender: 'male' | 'female';
  breed: string;
  personality: string;
  status: 'in_cafe' | 'reserved' | 'adopted';
  arrivalDate: string;
  arrivalType: 'found' | 'from_shelter' | 'from_owner';
  foundLocation?: string;
  finderName?: string;
  finderPhone?: string;
  medicalHistory: any[];
  image?: string;
}

export const catsService = {
  getAll: async (token: string): Promise<Cat[]> => {
    const response = await axios.get(`${API_URL}/cats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateStatus: async (id: string, status: Cat['status'], token: string): Promise<Cat> => {
    const response = await axios.patch(
      `${API_URL}/cats/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};