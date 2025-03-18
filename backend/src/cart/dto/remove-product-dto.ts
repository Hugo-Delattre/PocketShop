import { IsNotEmpty } from 'class-validator';

export class RemoveProductDto {
  @IsNotEmpty()
  productId: string;
  @IsNotEmpty()
  orderId: number;
  @IsNotEmpty()
  shopId: number;
  @IsNotEmpty()
  userId: number;
}
