import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { Orderline } from '../orderline/entities/orderline.entity';
import { Shop } from '../shop/entities/shop.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { ProductService } from '../product/product.service';
import { Cart } from './dto/product-list';
import { KpiService } from '../kpi/kpi.service';
import { Inventory } from '../inventory/entities/inventory.entity';

describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: {},
        },
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
          provide: getRepositoryToken(Product),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: {},
        },
        {
          provide: ProductService,
          useValue: {},
        },
        {
          provide: KpiService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
