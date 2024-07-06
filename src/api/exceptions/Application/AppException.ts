import { BadRequestError } from 'routing-controllers';

export class AppException extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
