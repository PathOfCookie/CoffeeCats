import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProductCategory {
  COFFEE = 'coffee',
  FOOD = 'food',
  LITTER = 'litter',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: ProductCategory })
  category: ProductCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  stock: number;

  @Column({ default: 'шт' })
  unit: string;

  @Column({ name: 'min_quantity', type: 'decimal', precision: 10, scale: 2, default: 1 })
  min_quantity: number;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ name: 'created_by' })
  created_by: number;
}