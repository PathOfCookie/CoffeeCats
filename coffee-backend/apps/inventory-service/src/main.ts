import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { InventoryServiceModule } from './inventory-service.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryServiceModule);
  
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('CoffeeCats Inventory Service')
    .setDescription('Сервис управления складом')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('inventory', 'Склад')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3004);
  console.log('Inventory service запущен на порту 3004');
  console.log('Swagger: http://localhost:3004/api/docs');
}
bootstrap();