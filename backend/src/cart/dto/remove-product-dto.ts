import { IsNotEmpty } from 'class-validator';

export class RemoveProductDto {
  @IsNotEmpty()
  productId: number;
  orderId: number;
  @IsNotEmpty()
  shopId: number;
}
