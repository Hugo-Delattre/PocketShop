import { IsNotEmpty } from 'class-validator';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';

export class Cart {
  products: Product[];

  @IsNotEmpty()
  user: User;
}
