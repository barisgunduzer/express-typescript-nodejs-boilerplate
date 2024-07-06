import { IsAlphanumeric, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordRequest {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  tokenTypeId: number;

  @MaxLength(20)
  @MinLength(8)
  @IsAlphanumeric()
  @IsNotEmpty()
  newPassword: string;

  @MaxLength(20)
  @MinLength(8)
  @IsAlphanumeric()
  @IsNotEmpty()
  confirmPassword: string;
}
