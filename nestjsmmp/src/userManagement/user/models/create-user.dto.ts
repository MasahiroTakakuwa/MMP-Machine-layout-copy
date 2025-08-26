import { IsString, IsEmail, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  user_name: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  password_confirm: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @IsOptional()
  @IsNumber()
  positionId?: number;

  @IsOptional()
  @IsArray()
  roleIds?: number[];
}
