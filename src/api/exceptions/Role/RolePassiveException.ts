import { ForbiddenError } from 'routing-controllers';

export class RolePassiveException extends ForbiddenError {
  constructor() {
    super('Changed role is passive.');
  }
}
