import { Kpi } from 'src/kpi/entities/kpi.entity';
import { KpiProducts } from 'src/kpi/entities/kpiProducts.entity';
import { Product } from 'src/product/entities/product.entity';

import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

const data = [
  {
    date: new Date(new Date().setDate(new Date().getDate() - 4)),
    nb_out_of_stock: 2,
    products: [{ product: { id: 1 } }, { product: { id: 2 } }],
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
    nb_out_of_stock: 3,
    products: [
      { product: { id: 6 } },
      { product: { id: 1 } },
      { product: { id: 3 } },
    ],
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    nb_out_of_stock: 1,
    products: [{ product: { id: 4 } }],
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    nb_out_of_stock: 0,
    products: [],
  },
  {
    date: new Date(),
    nb_out_of_stock: 6,
    products: [
      { product: { id: 6 } },
      { product: { id: 1 } },
      { product: { id: 3 } },
      { product: { id: 2 } },
      { product: { id: 4 } },
      { product: { id: 7 } },
    ],
  },
];

export default class KpiSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Kpi);
    const repoKpiProducts = dataSource.getRepository(KpiProducts);
    await repository.insert(data);

    const kpis = await repository.find();

    const kpiProducts = [];

    for (const kpi of kpis) {
      const { nb_out_of_stock, id } = kpi;
      for (let index = 0; index < nb_out_of_stock; index++) {
        const kpiProduct = new KpiProducts();
        kpiProduct.kpi = { id } as Kpi;
        kpiProduct.product = {
          id: Math.floor(Math.random() * 7) + 1,
        } as Product;

        kpiProducts.push(kpiProduct);
      }
    }
    await repoKpiProducts.save(kpiProducts);
  }
}
