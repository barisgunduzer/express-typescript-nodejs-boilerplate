import { IHashProvider } from '@base/infrastructure/services/hash/interfaces/IHashProvider';

export interface IHashService extends IHashProvider {
  setDriver(provider: string): this;
}
