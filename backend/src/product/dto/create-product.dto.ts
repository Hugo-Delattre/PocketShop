import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  open_food_fact_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  shopId: number;
}
