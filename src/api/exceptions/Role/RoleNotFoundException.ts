import { NotFoundError } from 'routing-controllers';

export class RoleNotFoundException extends NotFoundError {
  constructor() {
    super('Role not found');
  }
}
