import { Entity, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';

@Entity()
export class ProductCategory {
  @ManyToMany(() => Category, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  products: Product[];
}
