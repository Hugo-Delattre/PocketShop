import { Test, TestingModule } from '@nestjs/testing';
import { OrderlineController } from './orderline.controller';
import { OrderlineService } from './orderline.service';
import { CreateOrderlineDto } from './dto/create-orderline.dto';
import { UpdateOrderlineDto } from './dto/update-orderline.dto';

describe('OrderlineController', () => {
  let controller: OrderlineController;
  let service: OrderlineService;

  const mockOrderline = {
    id: 1,
    quantity: 2,
    price_at_order: 19.99,
    productId: 1,
    orderId: 1,
  };

  const mockOrderlineService = {
    create: jest.fn().mockResolvedValue(mockOrderline),
    findAll: jest.fn().mockResolvedValue([mockOrderline]),
    findOne: jest.fn().mockResolvedValue(mockOrderline),
    update: jest.fn().mockResolvedValue(mockOrderline),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderlineController],
      providers: [
        {
          provide: OrderlineService,
          useValue: mockOrderlineService,
        },
      ],
    }).compile();

    controller = module.get<OrderlineController>(OrderlineController);
    service = module.get<OrderlineService>(OrderlineService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an orderline', async () => {
      const dto: CreateOrderlineDto = {
        quantity: 2,
        price_at_order: 19.99,
        productId: 1,
        orderId: 1,
      };
      expect(await controller.create(dto)).toEqual(mockOrderline);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return array of orderlines', async () => {
      expect(await controller.findAll()).toEqual([mockOrderline]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a orderline by id', async () => {
      expect(await controller.findOne('1')).toEqual(mockOrderline);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an orderline', async () => {
      const updateDto: UpdateOrderlineDto = {
        quantity: 3,
      };
      expect(await controller.update('1', updateDto)).toEqual(mockOrderline);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an orderline', async () => {
      expect(await controller.remove('1')).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
