import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('CoffeeCats Auth Service')
    .setDescription('Сервис авторизации и управления пользователями')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Авторизация')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log('Auth service запущен на порту 3001');
  console.log('Swagger: http://localhost:3001/api/docs');
}
bootstrap();