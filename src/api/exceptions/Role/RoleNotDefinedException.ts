import { ForbiddenError } from 'routing-controllers';

export class RoleNotDefinedException extends ForbiddenError {
  constructor() {
    super('Role not defined to user');
  }
}
