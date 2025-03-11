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
import { Category } from './entities/category.entity';
import { Orderline } from 'src/orderline/entities/orderline.entity';

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
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Orderline)
    private readonly orderLineRepository: Repository<Orderline>,
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
    this.saveCategories(openFoodFactId, product);
    return this.productRepository.save(product);
  }
  private async saveCategories(openFoodFactId: string, product: Product) {
    const response = await fetch(`${urlOpenFoodFact}/${openFoodFactId}`);
    if (!response.ok) {
      throw new HttpException(
        `Failed to get info from open food fact with product id ${openFoodFactId}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    const data = await response.json();
    const productOFF: ProductOFF = data.product;
    product.categories = [];
    const categories = productOFF.categories
      .split(',')
      .map((category) => category.trim()); // FROM "categories": "Condiments, Sauces, ... ," to  ["Condiments", "Sauces", ...]
    for (const category of categories) {
      const categoryEntity = await this.categoryRepository.findOne({
        where: { name: category },
      });

      if (!categoryEntity) {
        const newCategory = this.categoryRepository.create({
          name: category,
        });
        this.categoryRepository.save(newCategory);
        product.categories.push(newCategory);
      } else {
        product.categories.push(categoryEntity);
      }
    }
    console.log(product.categories);
    this.productRepository.save(product);
  }
  async findAll(
    take: number,
    skip: number,
    search: string = '%',
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

  async recommended(userId: number): Promise<ProductInShop> {
    const products = await this.recommendedByLastBuy(userId);
    const lastBuy = products[0];
    console.log(lastBuy);
    if (!lastBuy) {
      throw new HttpException('No recent buy', HttpStatus.NO_CONTENT);
    }
    const categories = lastBuy.categories;
    const categoriesArray = categories
      .split(',')
      .map((category) => category.trim());
    const productsInShop = await this.recommendedByCategories(categoriesArray);
    return productsInShop[0];
  }

  async recommendedByCategories(
    categories: string[],
  ): Promise<ProductInShop[]> {
    console.log(categories + 'in service');
    const categoriesEntities = [];
    console.log(categories);
    for (const category of categories) {
      console.log(category + 'in service');
      const categoryEntity = await this.categoryRepository.findOne({
        where: { name: ILike(`%${category}%`) },
      });
      if (categoryEntity) {
        categoriesEntities.push(categoryEntity);

        const productsInShop =
          await this.getProductsByCategories(categoriesEntities);

        return productsInShop;
      }
    }
    if (categoriesEntities.length === 0) {
      throw new HttpException('Categories not found', HttpStatus.NO_CONTENT);
    }
  }
  async recommendedByLastBuy(userId: number): Promise<ProductInShop[]> {
    const ordelines = await this.orderLineRepository.find({
      where: { order: { user: { id: userId } } },
      relations: ['product', 'order'],
      take: 5,
      order: {
        order: {
          payment_date: 'DESC',
        },
      },
    });
    const products = ordelines.map((orderline) => orderline.product);
    if (ordelines.length === 0) {
      throw new HttpException('No recent buy', HttpStatus.NO_CONTENT);
    }
    const productsInShop =
      await this.convertListProductsToProductInShop(products);
    return productsInShop;
  }

  async bestSellers(ranking: number): Promise<ProductInShop[]> {
    const orderlines = await this.orderLineRepository.find({
      relations: ['product'],
      take: 5,
    });

    const productCounts = new Map<string, number>();
    orderlines.forEach((orderline) => {
      const productId = orderline.product.open_food_fact_id;
      productCounts.set(productId, (productCounts.get(productId) || 0) + 1);
    });

    const sortedProducts = [...productCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, ranking)
      .map(([productId]) => productId);

    const productsInShop = await Promise.all(
      sortedProducts.map((id) => this.findOne(id)),
    );

    return productsInShop;
  }
  private async getProductsByCategories(
    categories: Category[],
  ): Promise<ProductInShop[]> {
    const products = [];
    console.log(categories);
    for (const category of categories) {
      console.log(JSON.stringify(category) + 'loop');
      const productsByCategory = await this.productRepository.find({
        relations: ['categories'],
        where: {
          categories: {
            id: category.id,
          },
        },
      });
      products.push(...productsByCategory);
    }
    if (products.length === 0) {
      throw new HttpException('Products not found', HttpStatus.NO_CONTENT);
    }
    const productsInShop =
      await this.convertListProductsToProductInShop(products);
    return productsInShop;
  }

  private async convertListProductsToProductInShop(
    products: Product[],
  ): Promise<ProductInShop[]> {
    const productsInShop: ProductInShop[] = [];
    for (const product of products) {
      const productInShop = await this.findOne(product.open_food_fact_id);
      if (productInShop) {
        productsInShop.push(productInShop);
      }
    }
    return productsInShop;
  }
}
