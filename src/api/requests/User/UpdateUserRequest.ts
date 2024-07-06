import { IsEmail, IsMobilePhone, IsOptional, IsString, ValidateBy } from 'class-validator';
import { CustomTextValidator } from '@api/validators/CustomTextValidator';

export class UpdateUserRequest {
  @ValidateBy({ name: 'isValidUsername', constraints: [3, 30], validator: CustomTextValidator },
    { message: 'userName must be at least 3 and maximum 30 chars' })
  @IsString()
  @IsOptional()
  userName: string;

  @ValidateBy({ name: 'isValidFirstName', constraints: [3, 50], validator: CustomTextValidator },
    { message: 'firstname must be at least 3 and at most 50 chars' },
  )
  @IsString()
  @IsOptional()
  firstName: string;

  @ValidateBy({ name: 'isValidLastName', constraints: [3, 50], validator: CustomTextValidator },
    { message: 'lastName must be at least 3 and at most 50 chars.' },
  )
  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @IsMobilePhone()
  @IsString()
  @IsOptional()
  phoneNumber: string;
}
