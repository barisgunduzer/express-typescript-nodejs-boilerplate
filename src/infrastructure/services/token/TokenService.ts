import { authConfig } from '@base/config/auth';
import { Service } from 'typedi';
import { JWTProvider } from '@base/infrastructure/services/token/providers/JWTProvider';
import { AccessTokenType } from '@api/types/AccessToken';
import { ITokenService } from '@base/infrastructure/services/token/interfaces/ITokenService';
import { TokenPairType } from '@api/types/TokenPair';

@Service()
export class TokenService implements ITokenService {
  private provider: any;

  public constructor() {
    this.setProvider(authConfig.defaultProvider);
  }

  public setProvider(provider: string): this {
    if (provider === 'jwt') {
      this.provider = new JWTProvider();
    }
    return this;
  }

  public sign(payload: AccessTokenType, refreshToken: string): TokenPairType {
    return this.provider.sign(payload, refreshToken);
  }
}
