import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryServiceService } from './inventory-service.service';
import { InventoryItem, InventoryCategory } from './entities/inventory-item.entity';

describe('InventoryServiceService', () => {
  let service: InventoryServiceService;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
  };

  const mockInventoryRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

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
      providers: [
        InventoryServiceService,
        {
          provide: getRepositoryToken(InventoryItem),
          useValue: mockInventoryRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryServiceService>(InventoryServiceService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an inventory item by id', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(mockInventoryItem);

      const result = await service.findOne(1);
      expect(result).toEqual(mockInventoryItem);
      expect(mockInventoryRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw if inventory item not found', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Товар не найден');
    });
  });

  describe('update', () => {
    it('should update an inventory item', async () => {
      const updateDto = { stock: 10 };
      const updatedItem = { ...mockInventoryItem, stock: 10 };
      
      mockInventoryRepository.findOne.mockResolvedValue(mockInventoryItem);
      mockInventoryRepository.save.mockResolvedValue(updatedItem);

      const result = await service.update(1, updateDto);
      expect(result.stock).toBe(10);
      expect(mockInventoryRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all inventory items', async () => {
      const expected = [mockInventoryItem];
      mockQueryBuilder.getMany.mockResolvedValue(expected);

      const result = await service.findAll();
      expect(result).toEqual(expected);
    });

    it('should filter by category', async () => {
      const expected = [mockInventoryItem];
      mockQueryBuilder.getMany.mockResolvedValue(expected);

      const result = await service.findAll('coffee');
      expect(result).toEqual(expected);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('item.category = :category', { category: 'coffee' });
    });

    it('should filter low stock items', async () => {
      const expected = [mockInventoryItem];
      mockQueryBuilder.getMany.mockResolvedValue(expected);

      const result = await service.findAll(undefined, true);
      expect(result).toEqual(expected);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('item.stock <= item.min_quantity');
    });
  });

  describe('getAlerts', () => {
    it('should return low stock alerts', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockInventoryItem]);
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: 6000 });
      mockQueryBuilder.getRawMany.mockResolvedValue([{ category: 'coffee', count: 1, totalStock: 5.2 }]);

      const result = await service.getAlerts();
      
      expect(result.alerts).toHaveLength(1);
      expect(result.totalLowStock).toBe(1);
      expect(result.totalInventoryValue).toBe(6000);
      expect(result.byCategory).toHaveLength(1);
    });

    it('should return empty alerts when no low stock', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: 0 });
      mockQueryBuilder.getRawMany.mockResolvedValue([]);

      const result = await service.getAlerts();
      
      expect(result.alerts).toHaveLength(0);
      expect(result.totalLowStock).toBe(0);
      expect(result.totalInventoryValue).toBe(0);
    });
  });
});