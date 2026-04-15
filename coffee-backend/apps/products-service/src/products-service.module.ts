import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductCategory } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsServiceModule {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(category?: string, search?: string) {
    const query = this.productRepository.createQueryBuilder('product');

    if (category) {
      query.andWhere('product.category = :category', { category });
    }

    if (search) {
      query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    product.updated_at = new Date();
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }

  async getStats() {
    const total = await this.productRepository.count();

    const totalValueResult = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.price * product.stock)', 'total')
      .getRawOne();

    const lowStock = await this.productRepository
      .createQueryBuilder('product')
      .where('product.stock <= product.min_quantity')
      .getCount();

    const byCategory = await this.productRepository
      .createQueryBuilder('product')
      .select('product.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('product.category')
      .getRawMany();

    return {
      total,
      totalValue: Number(totalValueResult.total) || 0,
      lowStock,
      byCategory,
    };
  }
}