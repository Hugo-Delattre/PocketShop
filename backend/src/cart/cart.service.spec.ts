import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { Orderline } from '../orderline/entities/orderline.entity';
import { Shop } from '../shop/entities/shop.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Product } from '../product/entities/product.entity';

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Order),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Orderline),
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
          provide: getRepositoryToken(Product),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
