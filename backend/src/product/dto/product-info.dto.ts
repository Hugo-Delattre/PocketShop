import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductInfoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  open_food_fact_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  shopId: number;
  name: string;
  brands: string;
  product_name_fr: string;
  generic_name_fr: string;
  ingredients_text: string;
  link: string;
  categories: string[];
  ingredients: string[];
  allergens: string[];
  image_url: string;
  quantity: string;
}
