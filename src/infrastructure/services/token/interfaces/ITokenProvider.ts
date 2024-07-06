import { TokenPairType } from '@api/types/TokenPair';

export interface ITokenProvider {
  sign(payload: object, refreshToken: string): TokenPairType;
}
