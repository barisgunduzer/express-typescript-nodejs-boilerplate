import { UnauthorizedError } from 'routing-controllers';

export class InvalidCredentialsException extends UnauthorizedError {
  constructor() {
    super('Username or password is incorrect!');
  }
}
