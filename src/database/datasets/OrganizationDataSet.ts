import { Organization } from '@api/entities/Organization';

export const organizationDataSet: Partial<Organization>[] = [
  {
    code: '01',
    name: 'Organization 1',
    isActive: true,
  },
  {
    code: '02',
    name: 'Organization 2',
    parentId: 1,
    isActive: true,
  },
  {
    code: '03',
    name: 'Organization 3',
    isActive: true,
  },
];
