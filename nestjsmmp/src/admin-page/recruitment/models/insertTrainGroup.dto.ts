import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class Name{
    @IsNotEmpty()
    @ApiProperty({example: "1. Giới thiệu chung"})
    vi?: string;

    @ApiProperty({example: ""})
    en?:string;

    @ApiProperty({example: ""})
    jp?:string;
}

export class InsertTrainGroupDto{
    @IsNotEmpty()
    @ApiProperty({example: "1. Giới thiệu chung"})
    name?: Name;

    @IsNotEmpty()
    @ApiProperty({example: "[]"})
    description?: string;
}

export class InsertJobDto{
    @IsNotEmpty()
    @ApiProperty({example: "1. Giới thiệu chung"})
    name_vi?: string;

    @IsNotEmpty()
    @ApiProperty({example: ""})
    name_en?: string;

    @IsNotEmpty()
    @ApiProperty({example: ""})
    name_jp?: string;

    @IsNotEmpty()
    @ApiProperty({example: "active"})
    status?: string;

    @IsNotEmpty()
    @ApiProperty({example: ""})
    pdf_file?: string;
    
    @ApiProperty({example: ""})
    category?: any;
}

export class UpdateTrainGroupDto{
    @IsNotEmpty()
    @ApiProperty({example: 6})
    id?: number;

    name?: Name;

    @ApiProperty({example: ""})
    description?: string;
}

export class UpdateJobDto{
    @IsNotEmpty()
    @ApiProperty({example: 6})
    id?: number;

    @ApiProperty({example: "1. Giới thiệu chung"})
    name_vi?: string;

    @ApiProperty({example: "[]"})
    pdf_file?: string;

    @ApiProperty({example: "active/inactive"})
    status?: string;

    @ApiProperty({example: "active/inactive"})
    category?: any;
}