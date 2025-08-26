import { IsNotEmpty, IsOptional, IsString, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  permissionIds?: number[];
}
