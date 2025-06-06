import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaypalService } from '../paypal/paypal.service';
import { InvoiceService } from '../invoices/invoice.service';
import { ProductService } from '../product/product.service';
import { InventoryService } from '../inventory/inventory.service';
import { Inventory } from '../inventory/entities/inventory.entity';
import { ShopService } from '../shop/shop.service';
import { Shop } from '../shop/entities/shop.entity';
import { Category } from '../product/entities/category.entity';
import { OrderlineService } from 'src/orderline/orderline.service';
import { Orderline } from 'src/orderline/entities/orderline.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Product,
      Shop,
      Inventory,
      Category,
      Orderline,
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    PaypalService,
    InvoiceService,
    ProductService,
    ShopService,
    InventoryService,
    OrderlineService,
  ],
})
export class OrderModule {}
