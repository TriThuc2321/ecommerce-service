import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @ApiProperty({ default: false })
  isRemember = false;
}
export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken!: string;

  @ApiProperty({ default: false })
  isRemember = false;
}

export class RegisterDto extends OmitType(LoginDto, ['isRemember'] as const) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;
}

export class RecaptchaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token!: string;
}

export class GetPasswordDto {
  @ApiProperty()
  email!: string;
}

export class CodeDto {
  @ApiProperty()
  code!: string;
}
export class UserCodeDto {
  @ApiProperty()
  code!: string;
}
export class ResetPasswordDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}

export class ReActiveAccountDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}
