import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator"

export class BranchOverviewDto{

    @IsNotEmpty()
    x: number;

    @IsNotEmpty()
    y: number;

    @IsNotEmpty()
    w: number;

    @IsNotEmpty()
    h: number;

    @IsNotEmpty()
    group_name: string;
}

export class BranchOverviewListDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BranchOverviewDto)
    body: BranchOverviewDto[];
    
    @IsNotEmpty()
    language: string;
}

