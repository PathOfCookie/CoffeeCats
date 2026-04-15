import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { UpdateInventoryDto } from './dto/inventory.dto';

@Injectable()
export class InventoryServiceService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
  ) {}

  async findAll(category?: string, lowStockOnly?: boolean) {
    const query = this.inventoryRepository.createQueryBuilder('item');

    if (category) {
      query.andWhere('item.category = :category', { category });
    }

    if (lowStockOnly) {
      query.andWhere('item.stock <= item.min_quantity');
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Товар не найден');
    }
    return item;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const item = await this.findOne(id);
    Object.assign(item, updateInventoryDto);
    item.updated_at = new Date();
    return this.inventoryRepository.save(item);
  }

  async getAlerts() {
    const lowStockItems = await this.inventoryRepository
      .createQueryBuilder('item')
      .where('item.stock <= item.min_quantity')
      .getMany();

    const totalLowStock = lowStockItems.length;
    const totalValue = await this.inventoryRepository
      .createQueryBuilder('item')
      .select('SUM(item.price * item.stock)', 'total')
      .getRawOne();

    const byCategory = await this.inventoryRepository
      .createQueryBuilder('item')
      .select('item.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(item.stock)', 'totalStock')
      .groupBy('item.category')
      .getRawMany();

    return {
      alerts: lowStockItems.map(item => ({
        id: item.id,
        name: item.name,
        stock: item.stock,
        minQuantity: item.min_quantity,
        location: item.location,
      })),
      totalLowStock,
      totalInventoryValue: Number(totalValue.total) || 0,
      byCategory,
    };
  }
}