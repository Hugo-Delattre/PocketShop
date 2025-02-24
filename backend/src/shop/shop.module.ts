import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from '../shop/entities/shop.entity';
import { Inventory } from '../inventory/entities/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Inventory])],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
