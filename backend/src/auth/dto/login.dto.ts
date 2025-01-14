import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'louis',
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric('en-US', {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  username: string;

  @ApiProperty({
    example: 'Password1!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;
}
