import { RoleType } from '@api/types/Role';

type CurrentUser = {
  userId: number;
  userName: string;
  organizationId: number;
  activeRole: RoleType;
}

export { CurrentUser as CurrentUserType };
