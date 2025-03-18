import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Orderline } from 'src/orderline/entities/orderline.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { User } from 'src/user/entities/user.entity';
import { ProductService } from 'src/product/product.service';
import { KpiService } from 'src/kpi/kpi.service';
import { Kpi } from 'src/kpi/entities/kpi.entity';
import { KpiProducts } from 'src/kpi/entities/kpiProducts.entity';
import { OrderService } from 'src/order/order.service';
import { UserService } from 'src/user/user.service';
import { KpiController } from 'src/kpi/kpi.controller';
import { PaypalService } from 'src/paypal/paypal.service';
import { InvoiceService } from 'src/invoices/invoice.service';
import { Category } from '../product/entities/category.entity';
import { BillingDetail } from 'src/billing-details/entities/billing-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kpi]),
    TypeOrmModule.forFeature([KpiProducts]),
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([Orderline]),
    TypeOrmModule.forFeature([Shop]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Inventory]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([BillingDetail]),
  ],
  controllers: [CartController, KpiController],
  providers: [
    CartService,
    ProductService,
    KpiService,
    OrderService,
    KpiService,
    UserService,
    PaypalService,
    InvoiceService,
  ],
  exports: [CartService],
})
export class CartModule {}
