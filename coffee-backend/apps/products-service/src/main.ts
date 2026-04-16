import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ProductsServiceModule } from './products-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductsServiceModule);
  
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('CoffeeCats Products Service')
    .setDescription('Сервис управления товарами')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('products', 'Товары')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3002);
  console.log('Products service запущен на порту 3002');
  console.log('Swagger: http://localhost:3002/api/docs');
}
bootstrap();