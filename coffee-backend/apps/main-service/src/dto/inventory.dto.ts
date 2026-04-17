import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateInventoryDto {
  @ApiProperty({ required: false, example: 10.5, description: 'Количество на складе' })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiProperty({ required: false, example: 1200, description: 'Цена' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false, example: 'Склад А, стеллаж 3', description: 'Местоположение' })
  @IsOptional()
  @IsString()
  location?: string;
}