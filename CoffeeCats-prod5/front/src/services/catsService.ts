// src/services/catsService.ts
import axios from 'axios';
import { MAIN_SERVICE_URL } from './apiConfig';

interface BackendCat {
  id: number;
  name: string;
  age: number;
  color: string;
  gender: 'male' | 'female';
  breed: string;
  personality: string;
  status: 'in_cafe' | 'reserved' | 'adopted';
  arrival_date: string;
  arrival_type: 'found' | 'from_shelter' | 'from_owner';
  found_location?: string;
  finder_name?: string;
  finder_phone?: string;
  medical_history: any[];
  image_url?: string;
}

export interface Cat {
  id: number;
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

const mapCat = (cat: BackendCat): Cat => ({
  id: cat.id,
  name: cat.name,
  age: Number(cat.age),
  color: cat.color,
  gender: cat.gender,
  breed: cat.breed,
  personality: cat.personality,
  status: cat.status,
  arrivalDate: cat.arrival_date,
  arrivalType: cat.arrival_type,
  foundLocation: cat.found_location,
  finderName: cat.finder_name,
  finderPhone: cat.finder_phone,
  medicalHistory: cat.medical_history ?? [],
  image: cat.image_url,
});

export const catsService = {
  getAll: async (token: string): Promise<Cat[]> => {
    const response = await axios.get<BackendCat[]>(`${MAIN_SERVICE_URL}/cats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map(mapCat);
  },

  updateStatus: async (id: number, status: Cat['status'], token: string): Promise<Cat> => {
    const response = await axios.patch<BackendCat>(
      `${MAIN_SERVICE_URL}/cats/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return mapCat(response.data);
  },
};