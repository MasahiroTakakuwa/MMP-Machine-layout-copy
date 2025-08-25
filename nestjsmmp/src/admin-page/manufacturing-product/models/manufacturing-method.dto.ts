import { IsNotEmpty } from "class-validator";

export class ManufacturingMethod{

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    lang: string;

}



