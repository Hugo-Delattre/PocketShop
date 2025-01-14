import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { BillingDetail } from 'src/billing-details/entities/billing-detail.entity';

export default class OrderSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Order);
    const repositoryUser = dataSource.getRepository(User);
    const repositoryBilling = dataSource.getRepository(BillingDetail);

    const user = await repositoryUser.findOneBy({ username: 'admin' });
    const billing = await repositoryBilling.findOneBy({
      user: { id: user.id },
    });

    const paidOrder = new Order();
    paidOrder.billing = billing;
    paidOrder.user = user;
    paidOrder.creation_date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    paidOrder.is_paid = true;
    paidOrder.payment_date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    paidOrder.total_price = 0;

    const onGoingOrder = new Order();
    onGoingOrder.billing = billing;
    onGoingOrder.user = user;
    onGoingOrder.creation_date = new Date();
    onGoingOrder.is_paid = false;
    onGoingOrder.total_price = 0;

    await repository.insert([paidOrder, onGoingOrder]);
  }
}
