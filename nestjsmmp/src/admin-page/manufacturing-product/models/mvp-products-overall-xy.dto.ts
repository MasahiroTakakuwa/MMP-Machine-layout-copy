import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator"

export class MvpProductsOverallXY{

    @IsNotEmpty()
    x: number;

    @IsNotEmpty()
    y: number;

    @IsNotEmpty()
    width: number;

    @IsNotEmpty()
    height: number;

    @IsNotEmpty()
    group: number;
}

export class MvpProductsOverallXYListDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    lang: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MvpProductsOverallXY)
    body: MvpProductsOverallXY[];
    

}

