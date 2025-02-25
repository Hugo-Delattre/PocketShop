import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Product } from 'src/product/entities/product.entity';
import { Orderline } from 'src/orderline/entities/orderline.entity';
import { Order } from 'src/order/entities/order.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';

export default class OrderLineSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Orderline);
    const repositoryProduct = dataSource.getRepository(Product);
    const repositoryInventory = dataSource.getRepository(Inventory);
    const repositoryOrder = dataSource.getRepository(Order);

    const orders = await repositoryOrder.find();

    const orderlinesPromises = orders.map(async (order) => {
      const products = await repositoryProduct.find({ take: 3 });
      let amount = 0;
      const orderLines = products.map(async (product) => {
        const inventory = await repositoryInventory.findOneBy({
          product: { id: product.id },
        });
        const orderLine = new Orderline();

        orderLine.price_at_order = inventory.price;
        orderLine.quantity = Math.floor(Math.random() * inventory.quantity) + 1;
        orderLine.product = product;
        orderLine.order = order;
        const newPrice = orderLine.price_at_order * orderLine.quantity;
        amount += newPrice;

        await repository.insert(orderLine);
      });
      await Promise.all(orderLines);
      await repositoryOrder.update(order.id, {
        total_price: Number(amount.toFixed(2)),
      });
    });

    await Promise.all(orderlinesPromises);
  }
}
