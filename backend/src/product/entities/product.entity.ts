import { Inventory } from '../../inventory/entities/inventory.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  open_food_fact_id: string;

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventory: Inventory[];
}
