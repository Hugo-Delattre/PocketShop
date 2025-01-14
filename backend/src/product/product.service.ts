import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductInfoDto } from './dto/product-info.dto';

const urlOpenFoodFact = 'https://world.openfoodfacts.org/api/v2/product';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: string): Promise<ProductInfoDto | undefined> {
    const product = await this.productRepository.findOne({
      where: { open_food_fact_id: id },
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
    const externalProductDetails = await response.json();
    const productInfoDto: ProductInfoDto = {
      open_food_fact_id: product.open_food_fact_id,
      shopId: 1,
      name: externalProductDetails.product.name,
      brands: externalProductDetails.product.brands,
      product_name_fr: externalProductDetails.product.product_name_fr,
      generic_name_fr: externalProductDetails.product.generic_name_fr,
      ingredients_text: externalProductDetails.product.ingredients_text,
      link: externalProductDetails.product.link,
      categories: externalProductDetails.product.categories,
      ingredients: externalProductDetails.product.ingredients,
      allergens: externalProductDetails.product.allergens,
      image_url: externalProductDetails.product.image_url,
      quantity: externalProductDetails.product.quantity,
    };
    return productInfoDto;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.productRepository.update(id, updateProductDto);
    return this.productRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
