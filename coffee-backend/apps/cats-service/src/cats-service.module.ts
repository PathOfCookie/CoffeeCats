import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsServiceController } from './cats-service.controller';
import { CatsServiceService } from './cats-service.service';
import { Cat } from './entities/cat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  controllers: [CatsServiceController],
  providers: [CatsServiceService],
})
export class CatsServiceModule {}