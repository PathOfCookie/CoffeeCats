import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Елизавета', description: 'Имя пользователя' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'user@coffee.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '+7 (999) 123-45-67', required: false, description: 'Телефон' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'eliza@coffee.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...', description: 'Refresh токен' })
  @IsString()
  refresh_token: string;
}