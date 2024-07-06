import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { userDataSet } from '@base/database/datasets/UserDataSet';
import { UserRepository } from '@api/repositories/UserRepository';
import { User } from '@api/entities/User';

export class CreateMockUsers1713508564706 implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    // Seed from dataset
    userDataSet.map((data) => UserRepository.createOrFail(data));

    // Seed from factory
    const userFactory = factoryManager.get(User);
    // await userFactory.save();
    await userFactory.saveMany(10);
  }
}
