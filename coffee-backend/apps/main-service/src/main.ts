import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MainServiceModule } from './main-service.module';

async function bootstrap() {
  const app = await NestFactory.create(MainServiceModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('CoffeeCats Main API')
    .setDescription('Микросервис с основной логикой: товары, котики, склад')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('products', 'Управление товарами')
    .addTag('cats', 'Управление котиками')
    .addTag('inventory', 'Управление складом')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('Main service running on port 3000');
  console.log('Swagger: http://localhost:3000/api/docs');
}
bootstrap();