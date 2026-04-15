import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InventoryServiceService } from './inventory-service.service';
import { UpdateInventoryDto } from './dto/inventory.dto';
import { JwtAuthGuard } from './strategies/guards/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryServiceController {
  constructor(private readonly inventoryService: InventoryServiceService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('lowStock') lowStock?: string,
  ) {
    return this.inventoryService.findAll(category, lowStock === 'true');
  }

  @Get('alerts')
  async getAlerts() {
    return this.inventoryService.getAlerts();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.update(+id, updateInventoryDto);
  }
}