import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyRefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  token: string;
}
