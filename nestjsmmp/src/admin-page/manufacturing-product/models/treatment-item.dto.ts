import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator"

export class AddTreatmentItemDto{

    @IsNotEmpty()
    type: string

    @IsNotEmpty()
    material: string;

    @IsNotEmpty()
    supplier: string;

}

export class AddTreatmentItemDtoList {

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    lang: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddTreatmentItemDto)
    body: AddTreatmentItemDto[];
    
}

