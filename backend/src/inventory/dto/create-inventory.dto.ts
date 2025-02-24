import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    example: 9.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  shop_id: string;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsString()
  product_id: string;
}
