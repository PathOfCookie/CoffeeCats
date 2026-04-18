import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { Gender, CatStatus, ArrivalType } from '../entities/cat.entity';

export class CreateCatDto {
  @ApiProperty({ example: 'Барсик', description: 'Имя котика' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2, description: 'Возраст' })
  @IsNumber()
  age: number;

  @ApiProperty({ example: 'рыжий', description: 'Окрас' })
  @IsString()
  color: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE, description: 'Пол' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ required: false, example: 'дворовый', description: 'Порода' })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty({ required: false, example: 'Ласковый, любит спать', description: 'Характер' })
  @IsOptional()
  @IsString()
  personality?: string;

  @ApiProperty({ enum: CatStatus, required: false, default: CatStatus.IN_CAFE, description: 'Статус' })
  @IsOptional()
  @IsEnum(CatStatus)
  status?: CatStatus;

  @ApiProperty({ enum: ArrivalType, required: false, description: 'Тип поступления' })
  @IsOptional()
  @IsEnum(ArrivalType)
  arrival_type?: ArrivalType;

  @ApiProperty({ required: false, example: 'ул. Ленина', description: 'Место находки' })
  @IsOptional()
  @IsString()
  found_location?: string;

  @ApiProperty({ required: false, example: 'Елена', description: 'Кто нашел' })
  @IsOptional()
  @IsString()
  finder_name?: string;

  @ApiProperty({ required: false, example: '+7 (999) 123-45-67', description: 'Телефон нашедшего' })
  @IsOptional()
  @IsString()
  finder_phone?: string;

  @ApiProperty({ required: false, example: '2026-04-10', description: 'Дата усыновления' })
  @IsOptional()
  @IsDateString()
  adopted_date?: Date;

  @ApiProperty({ required: false, example: 'Семья Смирновых', description: 'Новый дом' })
  @IsOptional()
  @IsString()
  new_home?: string;

  @ApiProperty({ required: false, example: 'Иван Смирнов', description: 'Имя нового владельца' })
  @IsOptional()
  @IsString()
  new_owner_name?: string;

  @ApiProperty({ required: false, example: '+7 (999) 888-77-66', description: 'Телефон нового владельца' })
  @IsOptional()
  @IsString()
  new_owner_phone?: string;

  @ApiProperty({ required: false, example: 'ivan@example.com', description: 'Email нового владельца' })
  @IsOptional()
  @IsString()
  new_owner_email?: string;

  @ApiProperty({ required: false, example: [], description: 'История болезней' })
  @IsOptional()
  @IsArray()
  medical_history?: any[];

  @ApiProperty({ required: false, example: '/images/barsik.jpg', description: 'URL фото' })
  @IsOptional()
  @IsString()
  image_url?: string;
}

export class UpdateCatDto extends PartialType(CreateCatDto) {}