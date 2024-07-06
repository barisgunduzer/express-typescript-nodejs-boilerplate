import { IMailProvider } from '@base/infrastructure/services/mail/interfaces/IMailProvider';

export interface IMailService extends IMailProvider {
  setProvider(provider: string): this;
}
