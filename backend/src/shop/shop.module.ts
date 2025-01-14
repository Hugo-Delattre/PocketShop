import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from 'src/shop/entities/shop.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Inventory])],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
