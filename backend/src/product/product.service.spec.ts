import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Shop } from '../shop/entities/shop.entity';
import { mockShopRepository } from '../shop/test-data';
import { mockInventoryRepository } from '../inventory/test-data';

describe('ProductService', () => {
  let service: ProductService;

  const mockProduct = {
    id: 1,
    open_food_fact_id: '123456',
    shopId: 1,
  };

  const mockOpenFoodFactsResponse = {
    product: {
      name: 'Test Product',
      brands: 'Test Brand',
      product_name_fr: 'Produit Test',
      generic_name_fr: 'Test Générique',
      ingredients_text: 'Ingredients Test',
      link: 'http://test.com',
      categories: ['category1'],
      ingredients: ['ingredient1'],
      allergens: ['allergen1'],
      image_url: 'http://test.com/image.jpg',
      quantity: '100g',
    },
  };

  const mockProductRepository = {
    find: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    create: jest.fn().mockReturnValue(mockProduct),
    save: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
    findAndCount: jest.fn().mockResolvedValue([[mockProduct], 10]),
  };

  beforeEach(async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockOpenFoodFactsResponse),
      }),
    ) as jest.Mock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
        {
          provide: getRepositoryToken(Shop),
          useValue: mockShopRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      expect(await service.findAll(10, 0)).toEqual([[mockProduct], 10]);
    });
  });

  //   describe('findOne', () => {
  //     it('should return a single product with OpenFoodFacts data', async () => {
  //       const expectedProduct = {
  //         open_food_fact_id: mockProduct.open_food_fact_id,
  //         shopId: mockProduct.shopId,
  //         ...mockOpenFoodFactsResponse.product,
  //       };

  //       const result = await service.findOne(1);
  //       expect(result).toEqual(expectedProduct);
  //       expect(fetch).toHaveBeenCalledWith(
  //         `https://world.openfoodfacts.org/api/v2/product/${mockProduct.open_food_fact_id}`,
  //       );
  //     });

  //     it('should throw error when product not found', async () => {
  //       mockProductRepository.findOne.mockResolvedValueOnce(null);
  //       await expect(service.findOne(999)).rejects.toThrow(HttpException);
  //     });
  //   });
});
