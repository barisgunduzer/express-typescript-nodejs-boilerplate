import { UnauthorizedError } from 'routing-controllers';

export class PasswordSameException extends UnauthorizedError {
  constructor() {
    super('Your new password cannot be the same as your old password.');
  }
}
