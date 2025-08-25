import { IsNotEmpty} from "class-validator"

export class ManufacturingMethodItemContentDto{

    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    lang: string;

    content?: string;


}

