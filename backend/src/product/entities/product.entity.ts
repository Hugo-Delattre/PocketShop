import { KpiProducts } from '../../kpi/entities/kpiProducts.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  open_food_fact_id: string;

  @OneToMany(() => Inventory, (inventory) => inventory.product, {
    cascade: ['insert', 'update'],
  })
  inventory: Inventory[];

  @OneToMany(() => KpiProducts, (products) => products.product, {
    nullable: true,
    cascade: true,
  })
  kpis: KpiProducts[];

  @ManyToMany(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  categories: Category[];
}
