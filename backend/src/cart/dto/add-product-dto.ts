import { IsNotEmpty } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  productId: string;
  orderId: number;
  @IsNotEmpty()
  shopId: number;
  @IsNotEmpty()
  userId: number;
}
