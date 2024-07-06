import path from 'path';
import { appConfig } from '@base/config/app';
import { ormConfig } from '@base/config/orm';
import { DataSource, DataSourceOptions } from 'typeorm';

const options: DataSourceOptions = {
  applicationName: appConfig.appName,
  type: ormConfig.databaseType as 'postgres',
  database: ormConfig.databaseName,
  schema: ormConfig.schemaName,
  host: ormConfig.host,
  port: ormConfig.port,
  username: ormConfig.username,
  password: ormConfig.password,
  namingStrategy: ormConfig.namingStrategy,
  entities: [path.join(appConfig.appPath, ormConfig.entitiesPath)],
  migrations: [path.join(appConfig.appPath, ormConfig.migrationsPath)],
  subscribers: [path.join(appConfig.appPath, ormConfig.subscribersPath)],
  migrationsRun: ormConfig.migrationsRun,
  logging: ormConfig.allowLogging,
  synchronize: appConfig.isLocal || appConfig.isDevelopment ? ormConfig.synchronize : false,
  maxQueryExecutionTime: ormConfig.maxQueryExecutionTime,
};

const dataSource = new DataSource(options);
export default dataSource;
