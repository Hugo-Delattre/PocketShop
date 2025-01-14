import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  async create(createShopDto: CreateShopDto): Promise<Shop> {
    const shop = this.shopRepository.create(createShopDto);
    return this.shopRepository.save(shop);
  }

  async findAll(): Promise<Shop[]> {
    return this.shopRepository.find();
  }

  async findOne(id: number): Promise<Shop | undefined> {
    return this.shopRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateShopDto: UpdateShopDto,
  ): Promise<Shop | undefined> {
    await this.shopRepository.update(id, updateShopDto);
    return this.shopRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.shopRepository.delete(id);
  }
}
