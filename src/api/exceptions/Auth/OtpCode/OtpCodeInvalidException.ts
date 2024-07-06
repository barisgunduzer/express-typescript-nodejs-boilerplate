import { UnauthorizedError } from 'routing-controllers';

export class OtpCodeInvalidException extends UnauthorizedError {
  constructor() {
    super('You entered an invalid OTP code.');
  }
}
