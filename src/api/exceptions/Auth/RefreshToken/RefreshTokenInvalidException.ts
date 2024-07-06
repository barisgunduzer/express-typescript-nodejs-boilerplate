import { UnauthorizedError } from 'routing-controllers';

export class RefreshTokenInvalidException extends UnauthorizedError {
  constructor() {
    super('Invalid refresh token.');
  }
}
