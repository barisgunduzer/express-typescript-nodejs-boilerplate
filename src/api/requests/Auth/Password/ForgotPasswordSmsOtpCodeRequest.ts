import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ForgotPasswordSmsOtpCodeRequest {
  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  phone: string;
}
