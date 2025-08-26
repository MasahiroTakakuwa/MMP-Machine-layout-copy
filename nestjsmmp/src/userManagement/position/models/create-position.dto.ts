import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
