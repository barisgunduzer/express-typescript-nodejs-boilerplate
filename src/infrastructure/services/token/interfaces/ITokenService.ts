import { ITokenProvider } from '@base/infrastructure/services/token/interfaces/ITokenProvider';

export interface ITokenService extends ITokenProvider {
  setProvider(provider: string): this;
}
