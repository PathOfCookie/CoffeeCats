import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Product, ProductCategory } from './entities/product.entity';
import { Cat, CatStatus } from './entities/cat.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreateCatDto, UpdateCatDto } from './dto/cat.dto';
import { UpdateInventoryDto } from './dto/inventory.dto';

@Injectable()
export class MainServiceService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Cat) private catRepository: Repository<Cat>,
    @InjectRepository(InventoryItem) private inventoryRepository: Repository<InventoryItem>,
    private httpService: HttpService,
  ) {}

  private async validateToken(userId: number) {
    try {
      await firstValueFrom(
        this.httpService.post('http://auth-service:3001/auth/validate', { userId })
      );
      return true;
    } catch {
      throw new Error('Unauthorized');
    }
  }

  // Products
  async getProducts(category?: string, search?: string) {
    const qb = this.productRepository.createQueryBuilder('p');
    if (category) qb.andWhere('p.category = :category', { category });
    if (search) qb.andWhere('p.name ILIKE :search', { search: `%${search}%` });
    return qb.getMany();
  }
  async getProduct(id: number) {
    const p = await this.productRepository.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Товар не найден');
    return p;
  }
  async createProduct(dto: CreateProductDto, userId: number) {
    await this.validateToken(userId);
    return this.productRepository.save(this.productRepository.create({ ...dto, created_by: userId }));
  }
  async updateProduct(id: number, dto: UpdateProductDto) {
    const p = await this.getProduct(id);
    Object.assign(p, dto);
    return this.productRepository.save(p);
  }
  async deleteProduct(id: number) {
    const p = await this.getProduct(id);
    return this.productRepository.remove(p);
  }
  async getProductsStats() {
    const total = await this.productRepository.count();
    const totalValue = await this.productRepository.createQueryBuilder('p').select('SUM(p.price * p.stock)', 'total').getRawOne();
    const lowStock = await this.productRepository.createQueryBuilder('p').where('p.stock <= p.min_quantity').getCount();
    const byCategory = await this.productRepository.createQueryBuilder('p').select('p.category', 'category').addSelect('COUNT(*)', 'count').groupBy('p.category').getRawMany();
    return { total, totalValue: Number(totalValue?.total) || 0, lowStock, byCategory };
  }

  // Cats
  async getCats(status?: string, search?: string) {
    const qb = this.catRepository.createQueryBuilder('c');
    if (status) qb.andWhere('c.status = :status', { status });
    if (search) qb.andWhere('c.name ILIKE :search', { search: `%${search}%` });
    return qb.getMany();
  }
  async getCat(id: number) {
    const c = await this.catRepository.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Котик не найден');
    return c;
  }
  async createCat(dto: CreateCatDto, userId: number) {
    await this.validateToken(userId);
    return this.catRepository.save(this.catRepository.create({ ...dto, created_by: userId }));
  }
  async updateCat(id: number, dto: UpdateCatDto) {
    const c = await this.getCat(id);
    Object.assign(c, dto);
    return this.catRepository.save(c);
  }
  async deleteCat(id: number) {
    const c = await this.getCat(id);
    return this.catRepository.remove(c);
  }
  async getCatsStats() {
    const total = await this.catRepository.count();
    const inCafe = await this.catRepository.count({ where: { status: CatStatus.IN_CAFE } });
    const adopted = await this.catRepository.count({ where: { status: CatStatus.ADOPTED } });
    const reserved = await this.catRepository.count({ where: { status: CatStatus.RESERVED } });
    const avgAge = await this.catRepository.createQueryBuilder('c').select('AVG(c.age)', 'avg').getRawOne();
    const byColor = await this.catRepository.createQueryBuilder('c').select('c.color', 'color').addSelect('COUNT(*)', 'count').groupBy('c.color').getRawMany();
    return { total, inCafe, adopted, reserved, avgAge: Math.round(avgAge?.avg) || 0, byColor };
  }

  // Inventory
  async getInventory(category?: string, lowStockOnly?: boolean) {
    const qb = this.inventoryRepository.createQueryBuilder('i');
    if (category) qb.andWhere('i.category = :category', { category });
    if (lowStockOnly) qb.andWhere('i.stock <= i.min_quantity');
    return qb.getMany();
  }
  async updateInventory(id: number, dto: UpdateInventoryDto) {
    const i = await this.inventoryRepository.findOne({ where: { id } });
    if (!i) throw new NotFoundException('Товар не найден');
    Object.assign(i, dto);
    return this.inventoryRepository.save(i);
  }
  async getInventoryAlerts() {
    const lowStockItems = await this.inventoryRepository.createQueryBuilder('i').where('i.stock <= i.min_quantity').getMany();
    const totalValue = await this.inventoryRepository.createQueryBuilder('i').select('SUM(i.price * i.stock)', 'total').getRawOne();
    const byCategory = await this.inventoryRepository.createQueryBuilder('i').select('i.category', 'category').addSelect('COUNT(*)', 'count').addSelect('SUM(i.stock)', 'totalStock').groupBy('i.category').getRawMany();
    return { alerts: lowStockItems.map(i => ({ id: i.id, name: i.name, stock: i.stock, minQuantity: i.min_quantity })), totalLowStock: lowStockItems.length, totalInventoryValue: Number(totalValue?.total) || 0, byCategory };
  }
}