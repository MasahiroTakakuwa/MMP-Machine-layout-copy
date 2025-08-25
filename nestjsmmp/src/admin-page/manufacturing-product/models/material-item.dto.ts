import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator"

export class AddMMaterialItemDto{

    @IsNotEmpty()
    type: string

    @IsNotEmpty()
    material: string;

    @IsNotEmpty()
    supplier: string;

}

export class AddMMaterialItemDtoList {

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    lang: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddMMaterialItemDto)
    body: AddMMaterialItemDto[];
    
}

