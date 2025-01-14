import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
    const inventory = this.inventoryRepository.create(createInventoryDto);
    return this.inventoryRepository.save(inventory);
  }

  async findAll() {
    return this.inventoryRepository.find();
  }

  async findOne(id: number) {
    return this.inventoryRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    await this.inventoryRepository.update(id, updateInventoryDto);
    return this.inventoryRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    await this.inventoryRepository.delete(id);
  }
}
