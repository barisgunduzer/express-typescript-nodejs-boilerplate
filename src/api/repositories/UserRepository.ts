import dataSource from '@base/database/data-source';
import { User } from '@api/entities/User';
import { UserNotFoundException } from '@api/exceptions/User/UserNotFoundException';
import { FindOneOptions } from 'typeorm';
import { isNullOrEmpty } from '@base/utils/string';
import { UserAlreadyExistsException } from '@api/exceptions/User/UserAlreadyExistsException';

async function findOneOrFail(options: FindOneOptions<User>) {
  const user = await this.findOne(options);
  _checkUserIsValid(user);
  return user;
}

async function createOrFail(user: Partial<User>) {
  await _checkUserForCreate(user.userName, user.email, user.phone);
  return await this.save(user);
}

async function _checkUserForCreate(userName: string, email: string, phone: string): Promise<void> {
  const user = await UserRepository.findOneBy([{ userName }, { email }, { phone }]); // where or
  if (user) {
    throw new UserAlreadyExistsException();
  }
}

function _checkUserIsValid(user: User) {
  if (isNullOrEmpty(user)) {
    throw new UserNotFoundException();
  }
}

export const UserRepository = dataSource.getRepository(User).extend({
  findOneOrFail,
  createOrFail,
});
