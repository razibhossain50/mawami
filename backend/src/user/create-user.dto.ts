import { IsString, MinLength, IsOptional, IsIn, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @MinLength(5)
  confirmPassword: string;

  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin', 'superadmin'])
  role?: string;
}
