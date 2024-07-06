import { Service } from 'typedi';
import { CreateUserRequest } from '@api/requests/User/CreateUserRequest';
import { UpdateUserRequest } from '@api/requests/User/UpdateUserRequest';
import { UserRepository } from '@api/repositories/UserRepository';

@Service()
export class UserService {
  public async createUser(userCreateRequest: CreateUserRequest) {
    return await UserRepository.createOrFail(userCreateRequest);
  }

  public async getAllUsers(paginationOptions?: { skip: number, take: number }) {
    return await UserRepository.find({...paginationOptions, relations: ['roles'], order: { id: 'ASC' }});
  }

  public async getUserById(userId: number) {
    return await UserRepository.findOneOrFail({ where: { id: userId } });
  }

  public async updateUserById(userId: number, userUpdateRequest: UpdateUserRequest) {
    const user = await UserRepository.findOneOrFail({ where: { id: userId }, relations: ['roles'] });
    return await UserRepository.update(user.id, userUpdateRequest);
  }

  public async deleteUserById(userId: number) {
    const user = await UserRepository.findOneOrFail({ where: { id: userId } });
    return await UserRepository.softRemove(user);
  }
}
