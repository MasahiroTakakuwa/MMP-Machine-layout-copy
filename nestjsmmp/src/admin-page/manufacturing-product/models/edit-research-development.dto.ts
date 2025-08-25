import { IsNotEmpty } from "class-validator"

export class EditResearchDevelopmentItemDto{

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    page: number;
}


