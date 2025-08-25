import { IsNotEmpty } from "class-validator";

export class DelResearchDevelopmentContentDto{

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    page: number;

}



