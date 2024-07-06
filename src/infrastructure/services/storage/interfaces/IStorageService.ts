import { IStorageProvider } from '@base/infrastructure/services/storage/interfaces/IStorageProvider';

export interface IStorageService extends IStorageProvider {
  setProvider(providerName: string): this;
}
