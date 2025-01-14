import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';

describe('InventoryService', () => {
  let service: InventoryService;
  let repository: Repository<Inventory>;

  const mockInventory = {
    id: '1',
    price: 99.99,
    quantity: 10,
    shop_id: '1',
    product_id: '1',
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockInventory),
    save: jest.fn().mockResolvedValue(mockInventory),
    find: jest.fn().mockResolvedValue([mockInventory]),
    findOne: jest.fn().mockResolvedValue(mockInventory),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repository = module.get<Repository<Inventory>>(
      getRepositoryToken(Inventory),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an inventory', async () => {
      const dto = {
        price: 99.99,
        quantity: 10,
        shop_id: '1',
        product_id: '1',
      };
      expect(await service.create(dto)).toEqual(mockInventory);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of inventories', async () => {
      expect(await service.findAll()).toEqual([mockInventory]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find an inventory by id', async () => {
      expect(await service.findOne(1)).toEqual(mockInventory);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update an inventory', async () => {
      const updateDto = { quantity: 20 };
      expect(await service.update(1, updateDto)).toEqual(mockInventory);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete an inventory', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
