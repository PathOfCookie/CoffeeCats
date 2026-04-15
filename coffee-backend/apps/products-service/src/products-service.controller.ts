import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsServiceService } from './products-service.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@ApiTags('Товары')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsServiceController {
  constructor(private readonly productsService: ProductsServiceService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех товаров' })
  @ApiResponse({ status: 200, description: 'Список товаров успешно получен' })
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(category, search);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получить статистику по товарам' })
  @ApiResponse({ status: 200, description: 'Статистика успешно получена' })
  async getStats() {
    return this.productsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiResponse({ status: 200, description: 'Товар успешно найден' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый товар' })
  @ApiResponse({ status: 201, description: 'Товар успешно создан' })
  async create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    const userId = req.user.userId;
    const productData = { ...createProductDto, created_by: userId };
    return this.productsService.create(productData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить товар' })
  @ApiResponse({ status: 200, description: 'Товар успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар' })
  @ApiResponse({ status: 200, description: 'Товар успешно удален' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}