import { Product } from '../../product/entities/product.entity';
import { Shop } from '../../shop/entities/shop.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal' })
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Shop, (shop) => shop.inventory)
  shop: Shop;

  @ManyToOne(() => Product, (product) => product.inventory)
  product: Product;
}
