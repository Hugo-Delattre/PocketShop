import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpiService } from './kpi.service';
import { KpiProducts } from './entities/kpiProducts.entity';
import { OrderService } from 'src/order/order.service';
import { UserService } from 'src/user/user.service';
import { Kpi } from './entities/kpi.entity';
import { KpiController } from './kpi.controller';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Kpi, Product, KpiProducts])],
  controllers: [KpiController],
  providers: [KpiService, OrderService, UserService, ProductService],
  exports: [KpiService],
})
export class KpiModule {}
