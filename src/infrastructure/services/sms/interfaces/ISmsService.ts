import { ISmsProvider } from '@base/infrastructure/services/sms/interfaces/ISmsProvider';

export interface ISmsService extends ISmsProvider {
  setProvider(provider: string): this;
}
