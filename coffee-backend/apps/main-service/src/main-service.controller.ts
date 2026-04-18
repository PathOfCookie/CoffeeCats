import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { MainServiceService } from './main-service.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreateCatDto, UpdateCatDto } from './dto/cat.dto';
import { UpdateInventoryDto } from './dto/inventory.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class MainServiceController {
  constructor(private readonly service: MainServiceService) {}

  @Get('health')
  @UseGuards()
  health() {
    return { status: 'ok' };
  }

  // Products
  @Get('products') async getProducts(@Query('category') category?: string, @Query('search') search?: string) {
    return this.service.getProducts(category, search);
  }
  @Get('products/stats') async getProductsStats() { return this.service.getProductsStats(); }
  @Get('products/:id') async getProduct(@Param('id') id: string) { return this.service.getProduct(+id); }
  @Post('products') async createProduct(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.service.createProduct(dto, req.user.userId);
  }
  @Patch('products/:id') async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.updateProduct(+id, dto);
  }
  @Delete('products/:id') async deleteProduct(@Param('id') id: string) { return this.service.deleteProduct(+id); }

  // Cats
  @Get('cats') async getCats(@Query('status') status?: string, @Query('search') search?: string) {
    return this.service.getCats(status, search);
  }
  @Get('cats/stats') async getCatsStats() { return this.service.getCatsStats(); }
  @Get('cats/:id') async getCat(@Param('id') id: string) { return this.service.getCat(+id); }
  @Post('cats') async createCat(@Body() dto: CreateCatDto, @Req() req: any) {
    return this.service.createCat(dto, req.user.userId);
  }
  @Patch('cats/:id') async updateCat(@Param('id') id: string, @Body() dto: UpdateCatDto) {
    return this.service.updateCat(+id, dto);
  }
  @Delete('cats/:id') async deleteCat(@Param('id') id: string) { return this.service.deleteCat(+id); }

  // Inventory
  @Get('inventory') async getInventory(@Query('category') category?: string, @Query('lowStock') lowStock?: string) {
    return this.service.getInventory(category, lowStock === 'true');
  }
  @Get('inventory/alerts') async getInventoryAlerts() { return this.service.getInventoryAlerts(); }
  @Patch('inventory/:id') async updateInventory(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.service.updateInventory(+id, dto);
  }
}