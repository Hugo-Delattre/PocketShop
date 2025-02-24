import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { User } from '../user/entities/user.entity';
import { Shop } from '../shop/entities/shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Inventory]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Shop]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
