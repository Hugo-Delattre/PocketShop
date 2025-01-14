import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProduct = {
    id: 1,
    open_food_fact_id: '123456',
    shopId: 1,
  };

  const mockProductService = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        open_food_fact_id: '123456',
        shopId: 1,
      };
      expect(await controller.create(createProductDto)).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return array of products', async () => {
      expect(await controller.findAll()).toEqual([mockProduct]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      expect(await controller.findOne('1')).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        open_food_fact_id: '654321',
      };
      expect(await controller.update('1', updateProductDto)).toEqual(
        mockProduct,
      );
      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      expect(await controller.remove('1')).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
