import { IsNotEmpty } from "class-validator";

export class ResearchDevelopmentDto{

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    lang: string;
    
    @IsNotEmpty()
    content: string;

}


