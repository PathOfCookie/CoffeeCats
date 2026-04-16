import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Зерна эспрессо', description: 'Название товара' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Тёмная обжарка, 100% арабика', description: 'Описание' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1200, description: 'Цена' })
  @IsNumber()
  price: number;

  @ApiProperty({ enum: ProductCategory, example: ProductCategory.COFFEE, description: 'Категория' })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ example: 5.2, description: 'Количество на складе' })
  @IsNumber()
  stock: number;

  @ApiProperty({ required: false, example: 'кг', description: 'Единица измерения' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false, example: 2, description: 'Минимальное количество' })
  @IsOptional()
  @IsNumber()
  min_quantity?: number;

  @ApiProperty({ required: false, example: 'Итальянская кофейня', description: 'Поставщик' })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiProperty({ required: false, example: 'Склад А, стеллаж 3', description: 'Местоположение' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 1, description: 'ID создателя' })
  @IsNumber()
  created_by: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}