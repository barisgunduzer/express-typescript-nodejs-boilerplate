import { IsAlphanumeric, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUsernameRequest {
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsAlphanumeric()
  @MaxLength(20)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;
}
