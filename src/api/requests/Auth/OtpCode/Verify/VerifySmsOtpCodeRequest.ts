import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class VerifySmsOtpCodeRequest {
  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
