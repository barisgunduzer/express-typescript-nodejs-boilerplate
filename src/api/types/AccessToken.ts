import { RoleType } from '@api/types/Role';

interface AccessToken {
  userId: number;
  userName: string;
  organizationId: number;
  activeRole: RoleType;
}

export { AccessToken as AccessTokenType };
