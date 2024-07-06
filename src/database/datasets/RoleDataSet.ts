import { Role } from '@api/entities/Role';

export const roleDataSet: Partial<Role>[] = [
  { name: 'super-admin', displayName: 'Super Admin' },
  { organizationId: 1, name: 'organization-admin', displayName: 'Organization 1 Admin' },
  { organizationId: 1, name: 'organization-member', displayName: 'Organization 1 Member' },
];
