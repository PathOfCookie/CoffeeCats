import { IsEmail, IsString, MinLength, IsOptional, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsString() @MinLength(2) name: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsOptional() @IsString() phone?: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

export class RefreshTokenDto {
  @IsString() refreshToken: string;
}

export class ValidateUserDto {
  @IsNumber() userId: number;
}