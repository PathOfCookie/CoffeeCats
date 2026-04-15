import { IsString, IsNumber, IsOptional, IsEnum, IsDecimal } from 'class-validator';
import { ProductCategory } from '../entities/product.entity';
import { PartialType } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  min_quantity?: number;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsNumber()
  created_by: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}