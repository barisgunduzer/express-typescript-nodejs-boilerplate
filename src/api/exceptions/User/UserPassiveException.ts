import { ForbiddenError } from 'routing-controllers';

export class UserPassiveException extends ForbiddenError {
  constructor() {
    super('User is passive.');
  }
}
