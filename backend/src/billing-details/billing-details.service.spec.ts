import { Test, TestingModule } from '@nestjs/testing';
import { BillingDetailsService } from './billing-details.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BillingDetail } from './entities/billing-detail.entity';
import { Repository } from 'typeorm';
import { CreateBillingDetailDto } from './dto/create-billing-detail.dto';
import { UpdateBillingDetailDto } from './dto/update-billing-detail.dto';

describe('BillingDetailsService', () => {
  let service: BillingDetailsService;
  let repository: Repository<BillingDetail>;

  const mockBillingDetail = {
    id: 1,
    name: 'John Doe',
    address: '123 Main St',
    zip_code: '75000',
    city: 'Paris',
    country: 'France',
    user_id: 1,
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockBillingDetail),
    save: jest.fn().mockResolvedValue(mockBillingDetail),
    find: jest.fn().mockResolvedValue([mockBillingDetail]),
    findOne: jest.fn().mockResolvedValue(mockBillingDetail),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingDetailsService,
        {
          provide: getRepositoryToken(BillingDetail),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BillingDetailsService>(BillingDetailsService);
    repository = module.get<Repository<BillingDetail>>(
      getRepositoryToken(BillingDetail),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a billing detail', async () => {
      const dto: CreateBillingDetailDto = {
        name: 'John Doe',
        address: '123 Main St',
        zip_code: '75000',
        city: 'Paris',
        country: 'France',
        user_id: 1,
      };
      expect(await service.create(dto)).toEqual(mockBillingDetail);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of billing details', async () => {
      expect(await service.findAll()).toEqual([mockBillingDetail]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single billing detail', async () => {
      expect(await service.findOne(1)).toEqual(mockBillingDetail);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a billing detail', async () => {
      const updateDto: UpdateBillingDetailDto = {
        name: 'Updated Name',
      };
      expect(await service.update(1, updateDto)).toEqual(mockBillingDetail);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a billing detail', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
