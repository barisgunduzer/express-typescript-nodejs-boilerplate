import { ISimpleStorageServiceProvider } from '@base/infrastructure/services/s3/interfaces/ISimpleStorageServiceProvider';

export interface ISimpleStorageService extends ISimpleStorageServiceProvider {
  setProvider(provider: string): this;
}
