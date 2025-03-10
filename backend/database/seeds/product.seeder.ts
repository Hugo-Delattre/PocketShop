import { Product } from 'src/product/entities/product.entity';

import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Product);

    const ids = [
      '3263859883713',
      '8437011606013',
      '6111069000451',
      '3560070328918',
      '3266980033613',
      '3242274034054',
      '3242274030056',
      '6132500711033',
      '3017620425035',
    ];

    const products = ids.map((id) => {
      const product = new Product();
      product.open_food_fact_id = id;
      return product;
    });

    await repository.insert(products);
  }
}
