import { UnauthorizedError } from 'routing-controllers';

export class PasswordWrongException extends UnauthorizedError {
  constructor() {
    super('Your password is wrong.');
  }
}
