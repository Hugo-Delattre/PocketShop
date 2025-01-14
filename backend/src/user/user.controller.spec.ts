import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'hashedPassword123',
  };

  const mockUserService = {
    createUser: jest.fn().mockResolvedValue(mockUser),
    findAllUser: jest.fn().mockResolvedValue([mockUser]),
    viewUser: jest.fn().mockResolvedValue(mockUser),
    updateUser: jest.fn().mockResolvedValue(mockUser),
    removeUser: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      expect(await controller.create(createUserDto)).toEqual(mockUser);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      expect(await controller.findAll()).toEqual([mockUser]);
      expect(service.findAllUser).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      expect(await controller.findOne('1')).toEqual(mockUser);
      expect(service.viewUser).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'UpdatedJohn',
      };
      expect(await controller.update('1', updateUserDto)).toEqual(mockUser);
      expect(service.updateUser).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      expect(await controller.remove('1')).toBeUndefined();
      expect(service.removeUser).toHaveBeenCalledWith(1);
    });
  });

  describe('error handling', () => {
    it('should handle user not found', async () => {
      jest
        .spyOn(service, 'viewUser')
        .mockRejectedValue(new Error('User not found'));
      await expect(controller.findOne('999')).rejects.toThrow('User not found');
    });

    it('should handle invalid user creation', async () => {
      const invalidDto = { username: '' };
      jest
        .spyOn(service, 'createUser')
        .mockRejectedValue(new Error('Invalid input'));
      await expect(
        controller.create(invalidDto as CreateUserDto),
      ).rejects.toThrow('Invalid input');
    });
  });
});
