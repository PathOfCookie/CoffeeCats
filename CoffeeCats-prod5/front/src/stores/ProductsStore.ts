// src/stores/ProductsStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import { productsService, Product } from '../services/productsService';
import AuthStore from './AuthStore';

class ProductsStore {
  items: Product[] = [];
  loading: boolean = false;
  error: string | null = null;
  lastFetched: number | null = null;
  private authStore: AuthStore;

  constructor(authStore: AuthStore) {
    makeAutoObservable(this);
    this.authStore = authStore;
  }

  // Кэширование: данные живут 1 минуту
  private isCacheValid(): boolean {
    if (!this.lastFetched) return false;
    return Date.now() - this.lastFetched < 60 * 1000; // 1 минута
  }

  fetchProducts = async (force: boolean = false) => {
    if (!force && this.isCacheValid() && this.items.length > 0) {
      console.log('📦 Используем кэш товаров');
      return;
    }

    if (!this.authStore.accessToken) {
      this.error = 'Не авторизован';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const products = await productsService.getAll(this.authStore.accessToken);
      
      runInAction(() => {
        this.items = products;
        this.lastFetched = Date.now();
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Ошибка загрузки товаров';
        this.loading = false;
      });
    }
  };

  updateStock = async (id: number, stock: number) => {
    if (!this.authStore.accessToken) return;

    try {
      const updated = await productsService.updateStock(id, stock, this.authStore.accessToken);
      
      runInAction(() => {
        const index = this.items.findIndex(p => p.id === id);
        if (index !== -1) {
          this.items[index] = updated;
        }
      });
    } catch (error: any) {
      console.error('Ошибка обновления:', error);
    }
  };

  get lowStockProducts() {
    return this.items.filter(p => p.stock <= p.minQuantity);
  }

  get totalProducts() {
    return this.items.length;
  }

  get totalValue() {
    return this.items.reduce((sum, p) => sum + (p.price * p.stock), 0);
  }
}

export default ProductsStore;