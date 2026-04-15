import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();