import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { PaypalService } from '../paypal/paypal.service';
import { UpdateOrderDto } from '../order/dto/update-order.dto';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { ConfigService } from '@nestjs/config';
import { Product } from '../product/entities/product.entity';
import { Shop } from '../shop/entities/shop.entity';
import { InvoiceService } from '../invoices/invoice.service';
import { ProductService } from '../product/product.service';
import { InventoryService } from '../inventory/inventory.service';
import { Inventory } from '../inventory/entities/inventory.entity';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let paypalService: PaypalService;

  const mockOrder = {
    id: 1,
    total_price: 99.99,
    creation_date: new Date('2024-03-20'),
    payment_date: new Date('2024-03-20'),
    is_paid: true,
    userId: 1,
    billingId: 1,
  };

  const mockPaypalService = {
    createPaypalOrder: jest.fn().mockResolvedValue({
      id: 'MOCK_PAYPAL_ID',
      status: 'CREATED',
    }),
    capturePaypalOrder: jest.fn().mockResolvedValue({
      id: 'MOCK_PAYPAL_ID',
      status: 'COMPLETED',
    }),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockOrder),
    save: jest.fn().mockResolvedValue(mockOrder),
    find: jest.fn().mockResolvedValue([mockOrder]),
    findOne: jest.fn().mockResolvedValue(mockOrder),
    findOneBy: jest.fn().mockResolvedValue(mockOrder),
    update: jest.fn().mockResolvedValue(mockOrder),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };
  const mockRepositoryPaypal = {
    createPaypalOrder: jest.fn().mockResolvedValue({}),
    capturePaypalOrder: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        ProductService,
        InventoryService,
        {
          provide: PaypalService,
          useValue: mockPaypalService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'PAYPAL_CLIENT_ID') return 'mockClientId';
              if (key === 'PAYPAL_CLIENT_SECRET') return 'mockClientSecret';
              return null;
            }),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Shop),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: {},
        },
        {
          provide: PaypalService,
          useValue: mockRepositoryPaypal,
        },
        {
          provide: InvoiceService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    paypalService = module.get<PaypalService>(PaypalService);
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
