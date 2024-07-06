import { InternalServerError } from 'routing-controllers';

export class SmsSendException extends InternalServerError {
  constructor() {
    super('Failed to send sms');
  }
}
