import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiServiceModule } from './api-service.module';

const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');

async function bootstrap() {
  const app = await NestFactory.create(ApiServiceModule);

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('CoffeeCats API')
    .setDescription('API для антикафе с котиками')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Авторизация')
    .addTag('products', 'Товары')
    .addTag('cats', 'Котики')
    .addTag('inventory', 'Склад')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`API Gateway запущен на порту ${port}`);
  console.log(`Swagger документация: http://localhost:${port}/api/docs`);
}
bootstrap();