import { authConfig } from '@base/config/auth';
import * as jwt from 'jsonwebtoken';
import { TokenPairType } from '@api/types/TokenPair';
import { ITokenProvider } from '@base/infrastructure/services/token/interfaces/ITokenProvider';

export class JWTProvider implements ITokenProvider {
  public sign(payload: object, refreshToken: string): TokenPairType {
    return {
      accessToken: jwt.sign(payload, authConfig.providers.jwt.secret, {
        expiresIn: authConfig.providers.jwt.expiresIn,
      }),
      refreshToken,
      expiresIn: authConfig.providers.jwt.expiresIn,
    };
  }
}
