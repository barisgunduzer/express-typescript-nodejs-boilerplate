import { env } from '@base/utils/env';
import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';
import { toBool } from '@base/utils/bool';
import { camelCase, snakeCase } from 'typeorm/util/StringUtils';

class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  public tableName(className: string, customName: string): string {
    return customName || snakeCase(className);
  }

  public columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return snakeCase(embeddedPrefixes.concat('').join('_')) + (customName || snakeCase(propertyName));
  }

  public relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  public joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  public joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string, _secondPropertyName: string): string {
    return snakeCase(`${firstTableName}_${firstPropertyName.replace(/\./gi, '_')}_${secondTableName}`);
  }

  public joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return snakeCase(`${tableName}_${columnName || propertyName}`);
  }

  public primaryKeyName(tableOrName: Table | string): string {
    return `PK_${this.getTableName(tableOrName)}`;
  }

  public foreignKeyName(tableOrName: Table | string, _columnNames: string[], referencedTablePath?: string): string {
    return `FK_${this.getTableName(tableOrName)}_${this.getTableName(referencedTablePath)}`;
  }

  public uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    return `UQ_${this.getTableName(tableOrName)}_${columnNames.map((columnName) => this.pascalCase(columnName)).join('_')}`;
  }

  public indexName(tableOrName: Table | string, columnNames: string[]): string {
    return `IDX_${this.getTableName(tableOrName)}_${columnNames.map((columnName) => this.pascalCase(columnName)).join('_')}`;
  }

  protected getTableName(tableOrName: Table | string): string {
    tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    return this.pascalCase(tableOrName);
  }

  private pascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + camelCase(str.slice(1));
  }
}

export const ormConfig = {
  dataSourceDir: env('TYPEORM_DATA_SOURCE'),
  databaseType: env('TYPEORM_DATABASE_TYPE'),
  databaseName: env('TYPEORM_DATABASE_NAME'),
  schemaName: env('TYPEORM_SCHEMA_NAME'),

  host: env('TYPEORM_HOST'),
  port: Number(env('TYPEORM_PORT')),
  username: env('TYPEORM_USERNAME'),
  password: env('TYPEORM_PASSWORD'),

  entitiesPath: env('TYPEORM_ENTITIES'),
  migrationsPath: env('TYPEORM_MIGRATIONS'),
  subscribersPath: env('TYPEORM_SUBSCRIBERS'),
  seedersPath: env('TYPEORM_SEEDERS'),
  factoriesPath: env('TYPEORM_FACTORIES'),

  allowLogging: toBool(env('TYPEORM_ENABLE_LOGGING')),
  subscribersEnabled: toBool(env('TYPEORM_ENABLE_SUBSCRIBERS')),

  seedersEnabled: toBool(env('TYPEORM_ENABLE_SEEDERS_RUN')),
  migrationsRun: toBool(env('TYPEORM_ENABLE_MIGRATIONS_RUN')),
  synchronize: toBool(env('TYPEORM_ENABLE_SCHEMA_SYNCHRONIZATION')),

  maxQueryExecutionTime: Number(env('TYPEORM_MAX_QUERY_EXECUTION_TIME')),

  namingStrategy: new CustomNamingStrategy(),
};
