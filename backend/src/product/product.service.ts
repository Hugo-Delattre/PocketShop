import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

import { Inventory } from '../inventory/entities/inventory.entity';
import { Shop } from '../shop/entities/shop.entity';
import { ProductInShop, ProductOFF } from './dto/product-info.dto';

const urlOpenFoodFact = 'https://world.openfoodfacts.org/api/v2/product';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}
  countProducts() {
    return this.productRepository.count();
  }
  async create({ openFoodFactId, quantity, price }: CreateProductDto) {
    const isProductAlreadyCreated = await this.productRepository.findBy({
      open_food_fact_id: openFoodFactId,
    });

    if (isProductAlreadyCreated.length > 1) {
      throw new HttpException(
        'Product already in inventory',
        HttpStatus.CONFLICT,
      );
    }
    const inventory = this.inventoryRepository.create({
      price,
      quantity,
      shop: { id: 1 },
    });

    const product = this.productRepository.create({
      open_food_fact_id: openFoodFactId,
      inventory: [inventory],
    });
    return this.productRepository.save(product);
  }

  async findAll(
    take: number,
    skip: number,
    search: string = '',
  ): Promise<[Product[], number]> {
    return this.productRepository.findAndCount({
      relations: ['inventory', 'inventory.shop'],
      take,
      skip,
      where: [
        { open_food_fact_id: ILike(`%${search}%`) },
        { inventory: { shop: { name: ILike(`%${search}%`) } } },
      ],
    });
  }

  async findOne(openFoodFactId: string): Promise<ProductInShop | undefined> {
    const product = await this.productRepository.findOne({
      where: { open_food_fact_id: String(openFoodFactId) },
    });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    const response = await fetch(
      `${urlOpenFoodFact}/${product.open_food_fact_id}`,
    );
    if (!response.ok) {
      throw new HttpException(
        `Failed to get info from open food fact with product id ${product.id} with open food fact
         id : ${product.open_food_fact_id}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    const productOFF: ProductOFF = await response.json();

    const shop = await this.shopRepository.findOne({
      where: { id: 1 },
    });
    if (!shop) {
      throw new HttpException('Shop not found', HttpStatus.NOT_FOUND);
    }
    return await this.getProductInfos(product, shop, productOFF);
  }

  async getProductInfos(
    product: Product,
    shop: Shop,
    productOFF: ProductOFF,
  ): Promise<ProductInShop> {
    const inventory = await this.inventoryRepository.findOne({
      relations: ['product', 'shop'],
      where: { product, shop },
    });
    if (!inventory) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    const productInShop: ProductInShop = {
      ...productOFF,
      available: inventory.quantity > 0,
      availableQuantity: inventory.quantity,
      price: inventory.price,
    };
    return productInShop;
  }

  async findProductQuantity(product: Product, shop: Shop): Promise<number> {
    const inventory = await this.inventoryRepository.findOne({
      relations: ['product', 'shop'],
      where: { product, shop },
    });
    if (!inventory) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return inventory.quantity;
  }

  async findProductPrice(product: Product, shop: Shop): Promise<number> {
    const inventory = await this.inventoryRepository.findOne({
      relations: ['product', 'shop'],
      where: { product, shop },
    });
    if (!inventory) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return inventory.price;
  }

  async isProductAvailable(product: Product, shop: Shop): Promise<boolean> {
    const inventory = await this.inventoryRepository.findOne({
      relations: ['product', 'shop'],
      where: { product, shop },
    });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return inventory.quantity > 0;
  }

  async update(
    id: number,
    { quantity, price, openFoodFactId }: UpdateProductDto,
  ) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['inventory', 'inventory.shop'],
    });

    if (!product) throw new NotFoundException();

    // Find the specific inventory entry
    const inventoryItem = product.inventory.find((inv) => inv.shop.id === 1);

    if (inventoryItem) {
      // Update existing inventory
      if (price) {
        inventoryItem.price = price;
      }
      if (quantity) {
        inventoryItem.quantity = quantity;
      }
    }

    if (openFoodFactId) {
      product.open_food_fact_id = openFoodFactId;
    }

    // Save the changes
    return this.productRepository.save(product, { reload: false });
  }

  async remove(id: number): Promise<{ affectedRows: number }> {
    const presenceInInventories = await this.inventoryRepository.findBy({
      product: { id },
    });

    let affectedRows = 0;
    if (presenceInInventories && presenceInInventories.length > 0) {
      for (const inventory of presenceInInventories) {
        const update = await this.inventoryRepository.update(inventory.id, {
          quantity: 0,
        });

        affectedRows += update.affected ?? 0;
      }
    }
    return { affectedRows };
  }
}
