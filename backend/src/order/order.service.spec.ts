import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;

  const mockOrder = {
    id: 1,
    total_price: 99.99,
    creation_date: new Date('2024-03-20'),
    payment_date: new Date('2024-03-20'),
    is_paid: true,
    userId: 1,
    billingId: 1,
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockOrder),
    save: jest.fn().mockResolvedValue(mockOrder),
    find: jest.fn().mockResolvedValue([mockOrder]),
    findOne: jest.fn().mockResolvedValue(mockOrder),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      expect(await service.create(createOrderDto)).toEqual(mockOrder);
      expect(repository.create).toHaveBeenCalledWith(createOrderDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of orders', async () => {
      expect(await service.findAll()).toEqual([mockOrder]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      expect(await service.findOne(1)).toEqual(mockOrder);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should handle order not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow('Order not found');
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto: UpdateOrderDto = {
        is_paid: true,
        payment_date: new Date('2024-03-21'),
      };
      expect(await service.update(1, updateOrderDto)).toEqual(mockOrder);
      expect(repository.update).toHaveBeenCalledWith(1, updateOrderDto);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
