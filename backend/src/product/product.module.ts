import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { User } from '../user/entities/user.entity';
import { Shop } from '../shop/entities/shop.entity';
import { ShopService } from '../shop/shop.service';
import { InventoryService } from '../inventory/inventory.service';
import { Orderline } from '../orderline/entities/orderline.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Inventory]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Shop]),
    TypeOrmModule.forFeature([Orderline]),
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ShopService, InventoryService],
})
export class ProductModule {}
