import { IsNotEmpty } from 'class-validator';

export class RemoveProductDto {
  @IsNotEmpty()
  productId: string;
  orderId: number;
  @IsNotEmpty()
  shopId: number;
}
