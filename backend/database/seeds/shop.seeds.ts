import { SHOP_NAME } from 'database/config/data';
import { Shop } from 'src/shop/entities/shop.entity';

import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class ShopSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Shop);

    const shop = new Shop();

    shop.zip_code = 33520;
    shop.address = '16 rue Théodore Blanc';
    shop.city = 'Bordeaux';
    shop.name = SHOP_NAME;
    shop.country = 'France';

    await repository.insert(shop);
  }
}
