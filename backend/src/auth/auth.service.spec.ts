import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../user/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'hashedPassword123',
    email: 'test@test.com',
    first_name: 'Test',
    last_name: 'User',
    role: UserRole.USER,
    billing: [],
    order: [],
    creation_date: new Date(),
  };

  const mockUserService = {
    findOneWithPassword: jest.fn().mockResolvedValue(mockUser),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      jest.spyOn(service, 'validateUser');
      const result = await service.validateUser('testuser', 'password123');
      expect(userService.findOneWithPassword).toHaveBeenCalledWith('testuser');
      expect(result).toBeDefined();
    });

    it('should return null when user is not found', async () => {
      jest
        .spyOn(userService, 'findOneWithPassword')
        .mockResolvedValueOnce(null);
      const result = await service.validateUser('wronguser', 'password123');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return JWT token', async () => {
      const result = await service.login(mockUser);
      expect(result.access_token).toBeDefined();
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
    });
  });
});
