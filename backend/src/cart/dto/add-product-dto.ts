import { IsNotEmpty } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  productId: number;
  orderId: number;
  @IsNotEmpty()
  shopId: number;
  @IsNotEmpty()
  userId: number;
}
