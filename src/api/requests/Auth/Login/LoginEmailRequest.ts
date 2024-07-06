import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginEmailRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsAlphanumeric()
  @MaxLength(20)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;
}
