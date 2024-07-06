import { NotFoundError } from 'routing-controllers';

export class UserRoleNotFoundException extends NotFoundError {
  constructor() {
    super('User role not found');
  }
}
