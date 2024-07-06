import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordEmailOtpCodeRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
