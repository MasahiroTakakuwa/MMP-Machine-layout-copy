import { IsString, IsEmail, IsOptional, IsArray, IsNumber } from 'class-validator';

export class ChangePasswordrDto {
  @IsString()
  password_current: string;

  @IsString()
  password: string;

  @IsString()
  password_confirm: string;
}
