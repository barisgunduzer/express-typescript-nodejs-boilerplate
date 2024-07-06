import dataSource from '@base/database/data-source';
import { User } from '@api/entities/User';
import { FindOneOptions } from 'typeorm';
import { Organization } from '@api/entities/Organization';

function findOneOrFail(options: FindOneOptions<User>) {}

export const OrganizationRepository = dataSource.getRepository(Organization).extend({});
