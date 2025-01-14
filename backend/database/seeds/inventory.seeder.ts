import { SHOP_NAME } from 'database/config/data';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';

import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class InventorySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repositoryShop = dataSource.getRepository(Shop);
    const repositoryProducts = dataSource.getRepository(Product);

    const shop = await repositoryShop.findOneBy({
      name: SHOP_NAME,
    });
    const products = await repositoryProducts.find();

    const inventoryFactory = factoryManager.get(Inventory);

    const productsPromises = products.map(async (product) => {
      await inventoryFactory.save({ shop, product });
    });

    await Promise.all(productsPromises);
  }
}
