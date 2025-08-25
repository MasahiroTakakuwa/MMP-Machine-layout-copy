import { IsNotEmpty } from "class-validator"

export class MvpProductsOverallDto{

    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    lang: string; //en | jp

}

