import { IsNumber, IsNotEmpty, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  creation_date: Date;

  @ApiProperty()
  @IsDateString()
  payment_date: Date;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  is_paid: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNumber()
  billingId: number;
}
