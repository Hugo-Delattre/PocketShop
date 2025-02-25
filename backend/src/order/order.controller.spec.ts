import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { mockOrder, mockOrderService } from './test-data';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto: CreateOrderDto = {
        total_price: 99.99,
        creation_date: new Date('2024-03-20'),
        payment_date: new Date('2024-03-20'),
        is_paid: true,
        userId: 1,
        billingId: 1,
      };

      expect(await controller.create(createOrderDto)).toEqual(mockOrder);
      expect(service.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('findAllByUser', () => {
    it('should return array of orders', async () => {
      expect(await controller.findAllByUser(1)).toEqual([mockOrder]);
      expect(service.findAllbyUser).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      expect(await controller.findOne(1)).toEqual(mockOrder);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto: UpdateOrderDto = {
        is_paid: true,
        payment_date: new Date('2024-03-21'),
      };

      expect(await controller.update(1, updateOrderDto)).toEqual(mockOrder);
      expect(service.update).toHaveBeenCalledWith(1, updateOrderDto);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      expect(await controller.remove(1)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('error handling', () => {
    it('should handle order not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Order not found'));
      await expect(controller.findOne(999)).rejects.toThrow('Order not found');
    });

    it('should handle invalid create dto', async () => {
      const invalidDto = { total_price: -1 };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Invalid input'));
      await expect(
        controller.create(invalidDto as CreateOrderDto),
      ).rejects.toThrow('Invalid input');
    });
  });
});
