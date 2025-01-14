import { Test, TestingModule } from '@nestjs/testing';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

describe('ShopController', () => {
  let controller: ShopController;
  let service: ShopService;

  const mockShop = {
    id: 1,
    name: 'Test Shop',
    address: 'Test Address',
    zip_code: 31000,
    city: 'Test City',
    country: 'Test Country',
  };

  const mockShopService = {
    create: jest.fn().mockResolvedValue(mockShop),
    findAll: jest.fn().mockResolvedValue([mockShop]),
    findOne: jest.fn().mockResolvedValue(mockShop),
    update: jest.fn().mockResolvedValue(mockShop),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopController],
      providers: [
        {
          provide: ShopService,
          useValue: mockShopService,
        },
      ],
    }).compile();

    controller = module.get<ShopController>(ShopController);
    service = module.get<ShopService>(ShopService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a shop', async () => {
      const createShopDto: CreateShopDto = {
        name: 'Test Shop',
        address: 'Test Address',
        zip_code: 31000,
        city: 'Test City',
        country: 'Test Country',
      };

      expect(await controller.create(createShopDto)).toEqual(mockShop);
      expect(service.create).toHaveBeenCalledWith(createShopDto);
    });
  });

  describe('findAll', () => {
    it('should return array of shops', async () => {
      expect(await controller.findAll()).toEqual([mockShop]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a shop by id', async () => {
      expect(await controller.findOne('1')).toEqual(mockShop);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a shop', async () => {
      const updateShopDto: UpdateShopDto = {
        name: 'Updated Shop',
      };

      expect(await controller.update('1', updateShopDto)).toEqual(mockShop);
      expect(service.update).toHaveBeenCalledWith(1, updateShopDto);
    });
  });

  describe('remove', () => {
    it('should remove a shop', async () => {
      expect(await controller.remove('1')).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
