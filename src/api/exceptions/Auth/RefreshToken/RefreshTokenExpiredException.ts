import { BadRequestError } from 'routing-controllers';

export class RefreshTokenExpiredException extends BadRequestError {
  constructor() {
    super('Refresh token has expired.');
  }
}
