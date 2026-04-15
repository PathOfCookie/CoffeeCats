import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CatsServiceModule } from './cats-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CatsServiceModule);
  
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('CoffeeCats Cats Service')
    .setDescription('Сервис управления котиками')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('cats', 'Котики')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3003);
  console.log('Cats service запущен на порту 3003');
  console.log('Swagger: http://localhost:3003/api/docs');
}
bootstrap();