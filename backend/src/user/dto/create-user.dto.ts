import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @ApiProperty({
    example: 'Louis',
  })
  @IsString()
  @MinLength(2, { message: 'First name must have atleast 2 characters.' })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    example: 'leDev',
  })
  @IsString()
  @MinLength(2, { message: 'Last name must have atleast 2 characters.' })
  @IsNotEmpty()
  last_name: string;

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
    example: 'louis@yalink.fr',
  })
  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide valid Email.' })
  email: string;

  @ApiProperty({
    example: 'Password1!',
  })
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters,
    at least one uppercase letter,
    one lowercase letter,
    one number and
    one special character`,
  })
  password: string;
}
