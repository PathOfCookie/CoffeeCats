import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CatsServiceModule } from './cats-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CatsServiceModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3003);
}
bootstrap();