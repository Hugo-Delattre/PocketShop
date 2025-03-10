import { DataSource } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { DataSourceOptions } from 'typeorm/data-source';

import InitSeeder from '../seeds/init.seeder';
import { userFactory } from 'database/factories/user.factory';
import { billingDetailsFactory } from 'database/factories/billingDetails.factory';
import { inventoryFactory } from 'database/factories/inventory.factory';

const options = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'postgres',
  port: parseInt(String(process.env.DATABASE_PORT), 10) || 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [__dirname + '/../../src/**/*.entity.ts'],
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/../migrations/**/*.ts'],
  factories: [userFactory, billingDetailsFactory, inventoryFactory],
  seeds: [InitSeeder],
};

export const source = new DataSource(
  options as DataSourceOptions & SeederOptions,
);

source.initialize().then(async () => {
  await source.synchronize(true);
  await runSeeders(source);
  process.exit();
});
