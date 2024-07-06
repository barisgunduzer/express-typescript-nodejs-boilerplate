import { EntityTarget } from 'typeorm/common/EntityTarget';
import { DataSource, DeepPartial } from 'typeorm';

export class LookupFactory {
  static async insertData<TEntity>(entity: EntityTarget<TEntity>, dataSource: DataSource, dataset: DeepPartial<TEntity>[]) {
    const creator = new LookupFactory();
    await creator.create<TEntity>(entity, dataSource, dataset);
  }

  private async create<TEntity>(entity: EntityTarget<TEntity>, dataSource: DataSource, dataset: any[]): Promise<void> {
    const repo = dataSource.getRepository(entity);
    const count = await repo.count();
    if (count == 0) {
      await repo.save(dataset);
    }
  }
}
