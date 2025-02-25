import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { KpiProducts } from './kpiProducts.entity';

@Entity()
export class Kpi {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'date' })
  date: Date;
  @Column({ type: 'int' })
  nb_out_of_stock: number;

  @OneToMany(() => KpiProducts, (products) => products.kpi, {
    nullable: true,
    cascade: true,
  })
  products: KpiProducts[];
}
