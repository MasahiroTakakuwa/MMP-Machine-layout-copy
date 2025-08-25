import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator"

export class AddResearchDevelopmentItemDto{

    @IsNotEmpty()
    title: number;

    @IsNotEmpty()
    content: number;
}
export class AddResearchDevelopmentItemDtoList {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddResearchDevelopmentItemDto)
    body: AddResearchDevelopmentItemDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddResearchDevelopmentItemDto)
    body_jp: AddResearchDevelopmentItemDto[];
    
    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    describe: string;

    @IsNotEmpty()
    describe_jp: string;
}

