import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { InventoryServiceModule } from './inventory-service.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryServiceModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3004);
}
bootstrap();