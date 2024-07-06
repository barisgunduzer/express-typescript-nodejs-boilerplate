import { BadRequestError } from 'routing-controllers';

export class OtpCodeExpiredException extends BadRequestError {
  constructor() {
    super('OTP verification code has expired.');
  }
}
