import { IsNotEmpty} from "class-validator"

export class MvpProductsOverallContentDto{

    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    lang: string;

    content?: string;

}

