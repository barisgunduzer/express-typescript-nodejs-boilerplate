import { User } from '@api/entities/User';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  user.firstName = firstName;
  user.lastName = lastName;
  user.userName = faker.internet.userName({ firstName, lastName });
  user.email = faker.internet.email({ firstName, lastName });
  user.password = faker.internet.password({ memorable: true, length: 8 });
  user.isActive = faker.datatype.boolean();
  user.phone = faker.phone.number();

  return user;
});
