import { Product } from '../../product/entities/product.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Kpi } from './kpi.entity';

@Entity()
export class KpiProducts {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Kpi, {
    onDelete: 'CASCADE',
  })
  kpi: Kpi;
  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
