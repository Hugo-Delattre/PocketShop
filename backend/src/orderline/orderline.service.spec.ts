import { Test, TestingModule } from '@nestjs/testing';
import { OrderlineService } from './orderline.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Orderline } from './entities/orderline.entity';
import { Repository } from 'typeorm';
import { CreateOrderlineDto } from './dto/create-orderline.dto';
import { UpdateOrderlineDto } from './dto/update-orderline.dto';

describe('OrderlineService', () => {
  let service: OrderlineService;
  let repository: Repository<Orderline>;

  const mockOrderline = {
    id: 1,
    quantity: 2,
    price_at_order: 19.99,
    productId: 1,
    orderId: 1,
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockOrderline),
    save: jest.fn().mockResolvedValue(mockOrderline),
    find: jest.fn().mockResolvedValue([mockOrderline]),
    findOne: jest.fn().mockResolvedValue(mockOrderline),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderlineService,
        {
          provide: getRepositoryToken(Orderline),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrderlineService>(OrderlineService);
    repository = module.get<Repository<Orderline>>(
      getRepositoryToken(Orderline),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an orderline', async () => {
      const dto: CreateOrderlineDto = {
        quantity: 2,
        price_at_order: 19.99,
        productId: 1,
        orderId: 1,
      };
      expect(await service.create(dto)).toEqual(mockOrderline);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of orderlines', async () => {
      expect(await service.findAll()).toEqual([mockOrderline]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single orderline', async () => {
      expect(await service.findOne(1)).toEqual(mockOrderline);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update an orderline', async () => {
      const updateDto: UpdateOrderlineDto = {
        quantity: 3,
      };
      expect(await service.update(1, updateDto)).toEqual(mockOrderline);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an orderline', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
