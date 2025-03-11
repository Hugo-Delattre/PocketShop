import { BillingDetail } from 'src/billing-details/entities/billing-detail.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class BillingDetailSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);

    const user = await repository.findOneBy({
      username: 'admin',
    });
    const user2 = await repository.findOneBy({
      id: 2,
    });

    const postFactory = await factoryManager.get(BillingDetail);

    await postFactory.saveMany(2, { user });
    await postFactory.saveMany(2, { user: user2 });
  }
}
