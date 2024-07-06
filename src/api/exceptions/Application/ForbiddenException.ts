import { ForbiddenError } from 'routing-controllers';

export class ForbiddenException extends ForbiddenError {
  constructor(message: string) {
    super(message);
  }
}
