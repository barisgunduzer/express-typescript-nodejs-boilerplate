import { ForbiddenError } from 'routing-controllers';

export class RoleCannotSameException extends ForbiddenError {
  constructor() {
    super('Changed role cannot be same as current role.');
  }
}
