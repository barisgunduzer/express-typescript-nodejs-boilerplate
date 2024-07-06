import { ForbiddenError } from 'routing-controllers';

export class UserAlreadyExistsException extends ForbiddenError {
  constructor() {
    super('User already registered.');
  }
}
