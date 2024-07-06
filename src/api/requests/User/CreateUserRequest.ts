import {
  IsAlphanumeric,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateBy,
} from 'class-validator';
import { CustomTextValidator } from '@api/validators/CustomTextValidator';

export class CreateUserRequest {
  @ValidateBy({ name: 'customTextLength', constraints: [3, 30], validator: CustomTextValidator },
    { message: 'Username field must be at least 3 and maximum 30 characters' },
  )
  @IsString()
  @IsNotEmpty()
  userName: string;

  @MaxLength(20)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @MaxLength(20)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsMobilePhone()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @MaxLength(20)
  @MinLength(6)
  @IsAlphanumeric()
  @IsString()
  @IsNotEmpty()
  password: string;
}
