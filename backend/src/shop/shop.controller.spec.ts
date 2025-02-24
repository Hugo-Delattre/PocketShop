import { Test, TestingModule } from '@nestjs/testing';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { mockShop, mockShopService } from './test-data';

describe('ShopController', () => {
  let controller: ShopController;
  let service: ShopService;

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
      expect(await controller.findOne(1)).toEqual(mockShop);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a shop', async () => {
      const updateShopDto: UpdateShopDto = {
        name: 'Updated Shop',
      };

      expect(await controller.update(1, updateShopDto)).toEqual(mockShop);
      expect(service.update).toHaveBeenCalledWith(1, updateShopDto);
    });
  });

  describe('remove', () => {
    it('should remove a shop', async () => {
      expect(await controller.remove(1)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
