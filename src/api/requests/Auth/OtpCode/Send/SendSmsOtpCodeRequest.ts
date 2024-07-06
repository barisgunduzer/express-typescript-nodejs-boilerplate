import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SendSmsOtpCodeRequest {
  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  phone: string;
}
