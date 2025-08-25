import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class HomePageDto{
    @ApiProperty({example: 'header'})
    @IsNotEmpty()
    type: string

    @ApiProperty({example: 'abc'})
    discription: string

    @ApiProperty({example: 'abc'})
    sub_discription: string
    
}