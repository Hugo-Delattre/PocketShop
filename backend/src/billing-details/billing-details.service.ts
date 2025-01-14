import { Injectable } from '@nestjs/common';
import { CreateBillingDetailDto } from './dto/create-billing-detail.dto';
import { UpdateBillingDetailDto } from './dto/update-billing-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BillingDetail } from './entities/billing-detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BillingDetailsService {
  constructor(
    @InjectRepository(BillingDetail)
    private readonly billingDetailsRepository: Repository<BillingDetail>,
  ) {}

  async create(createBillingDetailDto: CreateBillingDetailDto) {
    const billingDetail = this.billingDetailsRepository.create(
      createBillingDetailDto,
    );
    return this.billingDetailsRepository.save(billingDetail);
  }

  findAll() {
    return this.billingDetailsRepository.find();
  }

  async findOne(id: number) {
    return this.billingDetailsRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateBillingDetailDto: UpdateBillingDetailDto) {
    await this.billingDetailsRepository.update(id, updateBillingDetailDto);
    return this.billingDetailsRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.billingDetailsRepository.delete(id);
  }
}
