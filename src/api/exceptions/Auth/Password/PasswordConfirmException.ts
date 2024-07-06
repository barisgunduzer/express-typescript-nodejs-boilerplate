import { UnauthorizedError } from 'routing-controllers';

export class PasswordConfirmException extends UnauthorizedError {
  constructor() {
    super('Current password and confirmation password do not match.');
  }
}
