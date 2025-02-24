import { BillingDetail } from '../../billing-details/entities/billing-detail.entity';
import { Orderline } from '../../orderline/entities/orderline.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal' })
  total_price: number;

  @Column()
  creation_date: Date;

  @Column({ nullable: true })
  payment_date: Date;

  @Column()
  is_paid: boolean;

  @Column({ nullable: true })
  paypal_order_id: string;

  @Column({ nullable: true })
  paypal_status: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => BillingDetail, { nullable: true })
  @JoinColumn({ name: 'billing_id' })
  billing: BillingDetail;

  @OneToMany(() => Orderline, (orderline) => orderline.order)
  orderlines: Orderline[];
}
