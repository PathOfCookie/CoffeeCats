import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CatsServiceService } from './cats-service.service';
import { CreateCatDto, UpdateCatDto } from './dto/cat.dto';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@Controller('cats')
@UseGuards(JwtAuthGuard)
export class CatsServiceController {
  constructor(private readonly catsService: CatsServiceService) {}

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.catsService.findAll(status, search);
  }

  @Get('stats')
  async getStats() {
    return this.catsService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.catsService.findOne(+id);
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }
}