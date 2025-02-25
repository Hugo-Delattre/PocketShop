import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from '../order/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaypalService } from '../paypal/paypal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService, PaypalService],
})
export class OrderModule {}
