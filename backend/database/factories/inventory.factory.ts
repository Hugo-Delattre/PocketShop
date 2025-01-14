import { setSeederFactory } from 'typeorm-extension';

import { Inventory } from 'src/inventory/entities/inventory.entity';

export const inventoryFactory = setSeederFactory(Inventory, async () => {
  const inventory = new Inventory();

  const randomPrice = parseFloat((Math.random() * (10 - 1) + 1).toFixed(2));
  const randomQuantity = Math.floor(Math.random() * 30) + 1;

  inventory.price = randomPrice;
  inventory.quantity = randomQuantity;

  return inventory;
});
