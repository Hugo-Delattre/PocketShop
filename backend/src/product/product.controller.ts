import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
  ) {
    return this.productService.findAll(take, skip, search);
  }

  @Get(':openFoodFactId')
  findOne(@Param('openFoodFactId') openFoodFactId: string) {
    return this.productService.findOne(openFoodFactId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productService.remove(+id);
  }

  @Get('/recommended/topOne/:userId')
  recommended(@Param('userId') userId: number) {
    this.productService.recommended(userId);
  }

  @Get('/recommended/lastBuy/:userId')
  recommendedByLastBuy(@Param('userId') userId: number) {
    return this.productService.recommendedByLastBuy(userId);
  }

  @Get('/recommended/categories')
  recommendedByCategories(@Body() categories: string[]) {
    console.log(categories + 'in controller');
    return this.productService.recommendedByCategories(categories);
  }

  @Get('/recommended/bestSellers/:ranking')
  bestSellers(@Param('ranking') ranking: number) {
    return this.productService.bestSellers(ranking);
  }
}
