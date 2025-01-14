import { IsNotEmpty } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

export class Cart {
  products: Product[];

  @IsNotEmpty()
  user: User;
}
