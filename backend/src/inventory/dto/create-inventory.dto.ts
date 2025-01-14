import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  shop_id: string;

  @IsNotEmpty()
  @IsString()
  product_id: string;
}
