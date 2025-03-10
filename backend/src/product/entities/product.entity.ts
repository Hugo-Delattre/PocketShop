import { KpiProducts } from '../../kpi/entities/kpiProducts.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
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

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @ManyToMany(() => Category, {
    onDelete: 'CASCADE',
  })
  categories: Category[];
}
