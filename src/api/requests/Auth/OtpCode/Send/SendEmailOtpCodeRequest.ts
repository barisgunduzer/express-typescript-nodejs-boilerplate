import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailOtpCodeRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
