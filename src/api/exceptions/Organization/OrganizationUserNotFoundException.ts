import { NotFoundError } from 'routing-controllers';

export class OrganizationUserNotFoundException extends NotFoundError {
  constructor() {
    super('No users found in the organization');
  }
}
