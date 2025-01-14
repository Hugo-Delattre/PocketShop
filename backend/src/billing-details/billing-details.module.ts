import { Module } from '@nestjs/common';
import { BillingDetailsService } from './billing-details.service';
import { BillingDetailsController } from './billing-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingDetail } from './entities/billing-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillingDetail])],
  controllers: [BillingDetailsController],
  providers: [BillingDetailsService],
})
export class BillingDetailsModule {}
