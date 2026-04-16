import { Test, TestingModule } from '@nestjs/testing';
import { InventoryServiceController } from './inventory-service.controller';
import { InventoryServiceService } from './inventory-service.service';
import { InventoryCategory } from './entities/inventory-item.entity';

describe('InventoryServiceController', () => {
  let controller: InventoryServiceController;
  let service: InventoryServiceService;

  const mockInventoryItem = {
    id: 1,
    name: 'Зерна эспрессо',
    description: 'Тёмная обжарка',
    price: 1200,
    category: InventoryCategory.COFFEE,
    stock: 5.2,
    unit: 'кг',
    min_quantity: 2,
    supplier: 'Итальянская кофейня',
    location: 'Склад А',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryServiceController],
      providers: [
        {
          provide: InventoryServiceService,
          useValue: {
            findAll: jest.fn(),
            update: jest.fn(),
            getAlerts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InventoryServiceController>(InventoryServiceController);
    service = module.get<InventoryServiceService>(InventoryServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of inventory items', async () => {
      const expected = [mockInventoryItem];
      jest.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('getAlerts', () => {
    it('should return low stock alerts', async () => {
      const expected = { alerts: [], totalLowStock: 0, totalInventoryValue: 0, byCategory: [] };
      jest.spyOn(service, 'getAlerts').mockResolvedValue(expected);

      const result = await controller.getAlerts();
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update inventory item', async () => {
      const updateDto = { stock: 10 };
      const expected = { ...mockInventoryItem, stock: 10 };
      jest.spyOn(service, 'update').mockResolvedValue(expected);

      const result = await controller.update('1', updateDto);
      expect(result).toEqual(expected);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });
});