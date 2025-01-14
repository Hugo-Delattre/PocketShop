import { Inventory } from '../../inventory/entities/inventory.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  zip_code: number;

  @Column()
  city: string;

  @Column()
  country: string;

  @OneToMany(() => Inventory, (inventory) => inventory.shop)
  inventory: Inventory[];
}
