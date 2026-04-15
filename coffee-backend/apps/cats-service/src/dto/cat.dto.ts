import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { Gender, CatStatus, ArrivalType } from '../entities/cat.entity';
import { PartialType } from '@nestjs/swagger';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  color: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  personality?: string;

  @IsOptional()
  @IsEnum(CatStatus)
  status?: CatStatus;

  @IsOptional()
  @IsEnum(ArrivalType)
  arrival_type?: ArrivalType;

  @IsOptional()
  @IsString()
  found_location?: string;

  @IsOptional()
  @IsString()
  finder_name?: string;

  @IsOptional()
  @IsString()
  finder_phone?: string;

  @IsOptional()
  @IsDateString()
  adopted_date?: Date;

  @IsOptional()
  @IsString()
  new_home?: string;

  @IsOptional()
  @IsString()
  new_owner_name?: string;

  @IsOptional()
  @IsString()
  new_owner_phone?: string;

  @IsOptional()
  @IsString()
  new_owner_email?: string;

  @IsOptional()
  @IsArray()
  medical_history?: any[];

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsNumber()
  created_by?: number;
}

export class UpdateCatDto extends PartialType(CreateCatDto) {}