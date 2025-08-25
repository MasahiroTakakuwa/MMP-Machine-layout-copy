import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class InsertJobDescriptionDto{
    @IsNotEmpty()
    @ApiProperty({example: '5'})
    job_id?: number;

    @IsNotEmpty()
    @ApiProperty({example: 'vfvf'})
    Position?: string;

    @IsNotEmpty()
    @ApiProperty({example: 'vfvf'})
    Job_description?: string;

    @IsNotEmpty()
    @ApiProperty({example: 'vfvf'})
    Requirements?: string;

    @IsNotEmpty()
    @ApiProperty({example: 'vfvf'})
    Salary?: string;

    @IsNotEmpty()
    @ApiProperty({example: 'vfvf'})
    Allowances?: string;

    @IsNotEmpty()
    @ApiProperty({example: 'vfvf'})
    Expire?: string;

    @IsNotEmpty()
    @ApiProperty({example: 'vfvf'})
    Interview_time?: string;

    @IsNotEmpty()
    @ApiProperty({example: 'vfvf'})
    Contact?: string;

    @IsNotEmpty()
    @ApiProperty({example: 'vfvf'})
    Email?: string;
}
