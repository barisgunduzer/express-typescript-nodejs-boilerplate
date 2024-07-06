import { ICacheProvider } from '@base/infrastructure/services/cache/interfaces/ICacheProvider';

export interface ICacheService extends ICacheProvider {
  manager(): any;
}
