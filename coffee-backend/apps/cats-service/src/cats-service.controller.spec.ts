import { Test, TestingModule } from '@nestjs/testing';
import { CatsServiceController } from './cats-service.controller';
import { CatsServiceService } from './cats-service.service';
import { CreateCatDto } from './dto/cat.dto';
import { Gender, CatStatus } from './entities/cat.entity';

describe('CatsServiceController', () => {
  let controller: CatsServiceController;
  let service: CatsServiceService;

  const mockCat = {
    id: 1,
    name: 'Барсик',
    age: 2,
    color: 'рыжий',
    gender: Gender.MALE,
    breed: 'дворовый',
    personality: 'Ласковый',
    status: CatStatus.IN_CAFE,
    arrival_date: new Date(),
    arrival_type: null,
    found_location: null,
    finder_name: null,
    finder_phone: null,
    adopted_date: null,
    new_home: null,
    new_owner_name: null,
    new_owner_phone: null,
    new_owner_email: null,
    medical_history: [],
    image_url: null,
    created_at: new Date(),
    created_by: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsServiceController],
      providers: [
        {
          provide: CatsServiceService,
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

    controller = module.get<CatsServiceController>(CatsServiceController);
    service = module.get<CatsServiceService>(CatsServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of cats', async () => {
      const expected = [mockCat];
      jest.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('create', () => {
    it('should create a cat', async () => {
      const dto: CreateCatDto = { 
        name: 'Барсик', 
        age: 2, 
        color: 'рыжий', 
        gender: Gender.MALE 
      };
      const expected = { id: 1, ...dto };
      jest.spyOn(service, 'create').mockResolvedValue(expected as any);

      const result = await controller.create(dto);
      expect(result).toEqual(expected);
    });
  });
});