import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailOtpCodeRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otpCode: string;
}
