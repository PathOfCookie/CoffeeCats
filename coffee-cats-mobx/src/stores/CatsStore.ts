// src/stores/CatsStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import { catsService, Cat } from '../services/catsService';
import AuthStore from './AuthStore';

class CatsStore {
  items: Cat[] = [];
  loading: boolean = false;
  error: string | null = null;
  lastFetched: number | null = null;
  private authStore: AuthStore;

  constructor(authStore: AuthStore) {
    makeAutoObservable(this);
    this.authStore = authStore;
  }

  private isCacheValid(): boolean {
    if (!this.lastFetched) return false;
    return Date.now() - this.lastFetched < 5 * 60 * 1000; // 5 минут
  }

  fetchCats = async (force: boolean = false) => {
    if (!force && this.isCacheValid() && this.items.length > 0) {
      console.log('🐱 Используем кэш котиков');
      return;
    }

    if (!this.authStore.accessToken) {
      this.error = 'Не авторизован';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const cats = await catsService.getAll(this.authStore.accessToken);
      
      runInAction(() => {
        this.items = cats;
        this.lastFetched = Date.now();
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Ошибка загрузки котиков';
        this.loading = false;
      });
    }
  };

  updateStatus = async (id: string, status: Cat['status']) => {
    if (!this.authStore.accessToken) return;

    try {
      const updated = await catsService.updateStatus(id, status, this.authStore.accessToken);
      
      runInAction(() => {
        const index = this.items.findIndex(c => c.id === id);
        if (index !== -1) {
          this.items[index] = updated;
        }
      });
    } catch (error: any) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  get catsInCafe() {
    return this.items.filter(c => c.status === 'in_cafe');
  }

  get adoptedCats() {
    return this.items.filter(c => c.status === 'adopted');
  }

  get reservedCats() {
    return this.items.filter(c => c.status === 'reserved');
  }
}

export default CatsStore;