import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUser = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'hashedPassword123',
    creation_date: new Date(),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([mockUser]),
    findAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    findOneBy: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      expect(await service.createUser(createUserDto)).toEqual(mockUser);
    });
  });

  describe('findAllUser', () => {
    it('should return array of users', async () => {
      expect(await service.findAllUser(1, 0)).toEqual([[mockUser], 1]);
    });
  });

  describe('viewUser', () => {
    it('should return a single user', async () => {
      expect(await service.viewUser(1)).toEqual(mockUser);
    });

    it('should handle user not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expect(service.viewUser(999)).rejects.toThrow();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto = { first_name: 'Updated' };
      expect(await service.updateUser(1, updateUserDto)).toEqual(mockUser);
    });
  });

  describe('removeUser', () => {
    it('should delete a user', async () => {
      await service.removeUser(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
