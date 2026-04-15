import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsServiceService } from './products-service.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsServiceController {
  constructor(private readonly productsService: ProductsServiceService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(category, search);
  }

  @Get('stats')
  async getStats() {
    return this.productsService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}