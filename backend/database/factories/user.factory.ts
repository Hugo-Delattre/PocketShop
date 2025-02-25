import { setSeederFactory } from 'typeorm-extension';

import { User, UserRole } from 'src/user/entities/user.entity';
import { Faker } from '@faker-js/faker';

export const userFactory = setSeederFactory(User, async (faker: Faker) => {
  const user = new User();

  const firstName = faker.person.firstName();

  user.first_name = firstName;
  user.last_name = faker.person.lastName();

  user.username = faker.internet.userName({
    firstName: user.first_name,
    lastName: user.last_name,
  });
  user.email = faker.internet.email({
    firstName: user.first_name,
    lastName: user.last_name,
  });

  user.role = faker.helpers.arrayElement([UserRole.USER]);

  user.creation_date = new Date(
    new Date().setDate(
      new Date().getDate() - (Math.floor(Math.random() * 14) + 1),
    ),
  );

  return user;
});
