import { genSalt, hash } from 'bcrypt';
import { User, UserRole } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);

    const salt = await genSalt();

    const password = await hash('Admin1!', salt);

    const data = {
      password,
      last_name: 'Doe',
      username: 'admin',
      isActivated: true,
      first_name: 'John',
      role: UserRole.ADMIN,
      email: 'johndoe@gmail.com',
    };

    const user = await repository.findOneBy({ username: data.username });

    // Insert only one record with this username.
    if (!user) {
      await repository.insert([data]);
    }

    // ---------------------------------------------------

    const userFactory = factoryManager.get(User);

    // Insert many records in database.
    await userFactory.saveMany(3, { password });
  }
}
