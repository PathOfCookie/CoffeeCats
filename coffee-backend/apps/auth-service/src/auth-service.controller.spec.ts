import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRole } from './entities/user.entity';

describe('AuthServiceController', () => {
  let controller: AuthServiceController;
  let service: AuthServiceService;

  const mockUser = {
    id: 1,
    name: 'Тест',
    email: 'test@test.com',
    role: UserRole.VOLUNTEER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthServiceController],
      providers: [
        {
          provide: AuthServiceService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshTokens: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthServiceController>(AuthServiceController);
    service = module.get<AuthServiceService>(AuthServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto: RegisterDto = {
        name: 'Тест',
        email: 'test@test.com',
        password: '123456',
      };
      const expected = { 
        access_token: 'token', 
        refresh_token: 'refresh',
        user: mockUser 
      };
      jest.spyOn(service, 'register').mockResolvedValue(expected);

      const result = await controller.register(dto);
      expect(result).toEqual(expected);
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const dto: LoginDto = { email: 'test@test.com', password: '123456' };
      const expected = { 
        access_token: 'token', 
        refresh_token: 'refresh',
        user: mockUser 
      };
      jest.spyOn(service, 'login').mockResolvedValue(expected);

      const result = await controller.login(dto);
      expect(result).toEqual(expected);
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const refreshToken = { refresh_token: 'old-refresh-token' };
      const expected = { 
        access_token: 'new-token', 
        refresh_token: 'new-refresh',
        user: mockUser 
      };
      jest.spyOn(service, 'refreshTokens').mockResolvedValue(expected);

      const result = await controller.refresh(refreshToken);
      expect(result).toEqual(expected);
      expect(service.refreshTokens).toHaveBeenCalledWith(refreshToken.refresh_token);
    });
  });
});