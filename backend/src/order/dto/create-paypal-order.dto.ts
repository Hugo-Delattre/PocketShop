import { ApiProperty } from '@nestjs/swagger';

export class CreatePaypalOrderDTO {
  @ApiProperty({
    example:
      'https://www.sandbox.paypal.com/checkoutnow?token=5XA55362S5855532J',
  })
  paypalUrl: string;

  @ApiProperty({
    example: 1,
  })
  orderId: number;

  @ApiProperty({
    example: 'CREATED',
  })
  status: string;
}
