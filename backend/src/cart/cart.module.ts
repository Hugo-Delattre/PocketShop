import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Orderline } from 'src/orderline/entities/orderline.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([Orderline]),
    TypeOrmModule.forFeature([Shop]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Inventory]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
