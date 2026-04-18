// src/stores/index.ts
import AuthStore from './AuthStore';
import ProductsStore from './ProductsStore';
import CatsStore from './CatsStore';

class RootStore {
  auth: AuthStore;
  products: ProductsStore;
  cats: CatsStore;

  constructor() {
    this.auth = new AuthStore();
    this.products = new ProductsStore(this.auth);
    this.cats = new CatsStore(this.auth);
  }
}

const rootStore = new RootStore();
export default rootStore;
export { RootStore, AuthStore, ProductsStore, CatsStore };