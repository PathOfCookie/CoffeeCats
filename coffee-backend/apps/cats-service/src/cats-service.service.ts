import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat, CatStatus } from './entities/cat.entity';
import { CreateCatDto, UpdateCatDto } from './dto/cat.dto';

@Injectable()
export class CatsServiceService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
  ) {}

  async findAll(status?: string, search?: string) {
    const query = this.catRepository.createQueryBuilder('cat');

    if (status) {
      query.andWhere('cat.status = :status', { status });
    }

    if (search) {
      query.andWhere('cat.name ILIKE :search', { search: `%${search}%` });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const cat = await this.catRepository.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException('Котик не найден');
    }
    return cat;
  }

  async create(createCatDto: CreateCatDto) {
    const cat = this.catRepository.create(createCatDto);
    return this.catRepository.save(cat);
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.findOne(id);
    Object.assign(cat, updateCatDto);
    return this.catRepository.save(cat);
  }

  async remove(id: number) {
    const cat = await this.findOne(id);
    return this.catRepository.remove(cat);
  }

  async getStats() {
    const total = await this.catRepository.count();
    
    const inCafe = await this.catRepository.count({
      where: { status: CatStatus.IN_CAFE }
    });
    
    const adopted = await this.catRepository.count({
      where: { status: CatStatus.ADOPTED }
    });
    
    const reserved = await this.catRepository.count({
      where: { status: CatStatus.RESERVED }
    });

    const avgAgeResult = await this.catRepository
      .createQueryBuilder('cat')
      .select('AVG(cat.age)', 'avg')
      .getRawOne();

    const byColor = await this.catRepository
      .createQueryBuilder('cat')
      .select('cat.color', 'color')
      .addSelect('COUNT(*)', 'count')
      .groupBy('cat.color')
      .getRawMany();

    return {
      total,
      inCafe,
      adopted,
      reserved,
      avgAge: Math.round(avgAgeResult.avg) || 0,
      byColor,
    };
  }
}