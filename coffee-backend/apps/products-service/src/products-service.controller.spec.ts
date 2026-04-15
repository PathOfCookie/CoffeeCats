import { Test, TestingModule } from '@nestjs/testing';
import { ProductsServiceController } from './products-service.controller';
import { ProductsServiceService } from './products-service.service';
import { CreateProductDto } from './dto/product.dto';
import { ProductCategory } from './entities/product.entity';

describe('ProductsServiceController', () => {
  let controller: ProductsServiceController;
  let service: ProductsServiceService;

  const mockProduct = {
    id: 1,
    name: 'Кофе',
    description: 'Вкусный кофе',
    price: 100,
    category: ProductCategory.COFFEE,
    stock: 10,
    unit: 'шт',
    min_quantity: 1,
    supplier: 'Поставщик',
    location: 'Склад',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsServiceController],
      providers: [
        {
          provide: ProductsServiceService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getStats: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsServiceController>(ProductsServiceController);
    service = module.get<ProductsServiceService>(ProductsServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of products', async () => {
      const expected = [mockProduct];
      jest.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('getStats', () => {
    it('should return statistics', async () => {
      const expected = { total: 10, totalValue: 5000, lowStock: 2, byCategory: [] };
      jest.spyOn(service, 'getStats').mockResolvedValue(expected);

      const result = await controller.getStats();
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto: CreateProductDto = {
        name: 'Новый кофе',
        price: 150,
        category: ProductCategory.COFFEE,
        stock: 5,
        created_by: 1,
      };
      const expected = { id: 2, ...dto, created_at: new Date(), updated_at: new Date() };
      jest.spyOn(service, 'create').mockResolvedValue(expected as any);

      const mockReq = { user: { userId: 1 } };
      const result = await controller.create(dto, mockReq);
      
      const expectedDto = { ...dto, created_by: mockReq.user.userId };
      expect(result).toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(expectedDto);
    });
  });
});