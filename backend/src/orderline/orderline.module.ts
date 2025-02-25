import { Module } from '@nestjs/common';
import { OrderlineService } from './orderline.service';
import { OrderlineController } from './orderline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orderline } from '../orderline/entities/orderline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orderline])],
  controllers: [OrderlineController],
  providers: [OrderlineService],
})
export class OrderlineModule {}
