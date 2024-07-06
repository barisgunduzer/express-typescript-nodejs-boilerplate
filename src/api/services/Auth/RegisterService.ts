import { Service } from 'typedi';
import { RegisterRequest } from '@base/api/requests/Auth/Register/RegisterRequest';
import { UserService } from '@api/services/User/UserService';
import { CreateUserRequest } from '@api/requests/User/CreateUserRequest';

@Service()
export class RegisterService {
  constructor(private userService: UserService) {}

  public async register(request: RegisterRequest) {
    await this.userService.createUser(request as CreateUserRequest);
  }
}
