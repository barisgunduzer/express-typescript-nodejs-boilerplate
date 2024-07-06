import { DataSource } from 'typeorm';
import { Role } from '@api/entities/Role';
import { Seeder } from 'typeorm-extension';
import { LookupFactory } from '@base/database/factories/LookupFactory';
import { OtpCodeType } from '@api/entities/OtpCodeType';
import { otpCodeTypeDataSet } from '@base/database/datasets/OtpCodeTypeDataSet';
import { Organization } from '@api/entities/Organization';
import { organizationDataSet } from '@base/database/datasets/OrganizationDataSet';
import { roleDataSet } from '@base/database/datasets/RoleDataSet';

export class CreateLookupTables1713508214427 implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await LookupFactory.insertData<Organization>(Organization, dataSource, organizationDataSet);
    await LookupFactory.insertData<OtpCodeType>(OtpCodeType, dataSource, otpCodeTypeDataSet);
    await LookupFactory.insertData<Role>(Role, dataSource, roleDataSet);
  }
}
