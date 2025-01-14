import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';

import { userFactory } from 'database/factories/user.factory';
import { billingDetailsFactory } from 'database/factories/billingDetails.factory';
import UserSeeder from './user.seeder';
import BillingDetailSeeder from './billingDetail.seeder';
import ShopSeeder from './shop.seeds';
import ProductSeeder from './product.seeder';
import InventorySeeder from './inventory.seeder';
import { inventoryFactory } from 'database/factories/inventory.factory';
import OrderSeeder from './order.seeder';
import OrderLineSeeder from './orderline.seeder';

export default class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [
        UserSeeder,
        BillingDetailSeeder,
        ShopSeeder,
        ProductSeeder,
        InventorySeeder,
        OrderSeeder,
        OrderLineSeeder,
      ],
      factories: [userFactory, billingDetailsFactory, inventoryFactory],
    });
  }
}
