import { Test, TestingModule } from '@nestjs/testing';
import { BillingDetailsController } from './billing-details.controller';
import { BillingDetailsService } from './billing-details.service';
import { CreateBillingDetailDto } from './dto/create-billing-detail.dto';
import { UpdateBillingDetailDto } from './dto/update-billing-detail.dto';

describe('BillingDetailsController', () => {
  let controller: BillingDetailsController;
  let service: BillingDetailsService;

  const mockBillingDetail = {
    id: 1,
    name: 'John Doe',
    address: '123 Main St',
    zip_code: '75000',
    city: 'Paris',
    country: 'France',
    user_id: 1,
  };

  const mockBillingDetailsService = {
    create: jest.fn().mockResolvedValue(mockBillingDetail),
    findAll: jest.fn().mockResolvedValue([mockBillingDetail]),
    findOne: jest.fn().mockResolvedValue(mockBillingDetail),
    update: jest.fn().mockResolvedValue(mockBillingDetail),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingDetailsController],
      providers: [
        {
          provide: BillingDetailsService,
          useValue: mockBillingDetailsService,
        },
      ],
    }).compile();

    controller = module.get<BillingDetailsController>(BillingDetailsController);
    service = module.get<BillingDetailsService>(BillingDetailsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      expect(await controller.create(dto)).toEqual(mockBillingDetail);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return array of billing details', async () => {
      expect(await controller.findAll()).toEqual([mockBillingDetail]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a billing detail by id', async () => {
      expect(await controller.findOne('1')).toEqual(mockBillingDetail);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a billing detail', async () => {
      const updateDto: UpdateBillingDetailDto = {
        name: 'Updated Name',
      };
      expect(await controller.update('1', updateDto)).toEqual(
        mockBillingDetail,
      );
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a billing detail', async () => {
      expect(await controller.remove('1')).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
