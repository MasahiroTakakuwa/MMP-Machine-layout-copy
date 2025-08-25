import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Name } from "./insertTrainGroup.dto";

export class InsertJobGroupDto{
    @IsNotEmpty()
    @ApiProperty({example: "Kỹ thuật"})
    name?: Name;
}

export class UpdateJobGroupDto{
    @IsNotEmpty()
    @ApiProperty({example: 11})
    id?: number;

    @IsNotEmpty()
    @ApiProperty({example: "Kỹ thuật"})
    name?: Name;
}

export class InsertNewJobDto{
    @IsNotEmpty()
    // @ApiProperty({example: "Kỹ sư CNTT"})
    name?: string;

    @IsNotEmpty()
    @ApiProperty({example: 5})
    category?: string;
}

export class UpdateNewJobDto{
    @IsNotEmpty()
    @ApiProperty({example: 11})
    id?: number;

    @ApiProperty({example: "Kỹ sư CNTT"})
    name?: string;

    @ApiProperty({example: 5})
    category?: any;

    @ApiProperty({example: ''})
    status: string;
}