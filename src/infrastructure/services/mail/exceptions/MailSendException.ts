import { InternalServerError } from 'routing-controllers';

export class MailSendException extends InternalServerError {
  constructor() {
    super('Failed to send email.');
  }
}
