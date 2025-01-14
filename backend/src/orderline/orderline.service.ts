import { Injectable } from '@nestjs/common';
import { CreateOrderlineDto } from './dto/create-orderline.dto';
import { UpdateOrderlineDto } from './dto/update-orderline.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Orderline } from './entities/orderline.entity';

@Injectable()
export class OrderlineService {
  constructor(
    @InjectRepository(Orderline)
    private readonly orderlineRepository: Repository<Orderline>,
  ) {}

  async create(createOrderlineDto: CreateOrderlineDto): Promise<Orderline> {
    const orderline = this.orderlineRepository.create(createOrderlineDto);
    return this.orderlineRepository.save(orderline);
  }

  async findAll(): Promise<Orderline[]> {
    return this.orderlineRepository.find();
  }

  async findOne(id: number): Promise<Orderline | undefined> {
    return this.orderlineRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateOrderlineDto: UpdateOrderlineDto,
  ): Promise<Orderline | undefined> {
    await this.orderlineRepository.update(id, updateOrderlineDto);
    return this.orderlineRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.orderlineRepository.delete(id);
  }
}
