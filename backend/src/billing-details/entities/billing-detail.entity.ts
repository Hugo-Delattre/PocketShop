import { Order } from '../../order/entities/order.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BillingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  zip_code: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @ManyToOne(() => User, (user) => user.billing)
  user: User;

  @OneToMany(() => Order, (order) => order.billing)
  order: Order[];
}
