import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderlineDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price_at_order: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;
}
