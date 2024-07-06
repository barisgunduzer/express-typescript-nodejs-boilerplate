import { IsAlphanumeric, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordRequest {
  @IsAlphanumeric()
  @MaxLength(20)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsAlphanumeric()
  @MaxLength(20)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsAlphanumeric()
  @MaxLength(20)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
