import { Test, TestingModule } from '@nestjs/testing';
import { ShopService } from './shop.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Repository } from 'typeorm';

describe('ShopService', () => {
  let service: ShopService;
  let repository: Repository<Shop>;

  const mockShop = {
    id: 1,
    name: 'Test Shop',
    address: 'Test Address',
    zip_code: 31000,
    city: 'Test City',
    country: 'Test Country',
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockShop),
    save: jest.fn().mockResolvedValue(mockShop),
    find: jest.fn().mockResolvedValue([mockShop]),
    findOne: jest.fn().mockResolvedValue(mockShop),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopService,
        {
          provide: getRepositoryToken(Shop),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ShopService>(ShopService);
    repository = module.get<Repository<Shop>>(getRepositoryToken(Shop));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a shop', async () => {
      const createShopDto = {
        name: 'Test Shop',
        address: 'Test Address',
        zip_code: 31000,
        city: 'Test City',
        country: 'Test Country',
      };

      expect(await service.create(createShopDto)).toEqual(mockShop);
      expect(repository.create).toHaveBeenCalledWith(createShopDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of shops', async () => {
      expect(await service.findAll()).toEqual([mockShop]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a shop', async () => {
      expect(await service.findOne(1)).toEqual(mockShop);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a shop', async () => {
      const updateShopDto = { name: 'Updated Shop' };
      expect(await service.update(1, updateShopDto)).toEqual(mockShop);
      expect(repository.update).toHaveBeenCalledWith(1, updateShopDto);
    });
  });

  describe('remove', () => {
    it('should remove a shop', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
