import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdateInventoryDto {
  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  location?: string;
}

export class CreateInventoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsString()
  category: string;

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