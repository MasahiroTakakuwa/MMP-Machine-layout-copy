import { IsNotEmpty } from "class-validator";

export class DelResponseCapacityItemContentDto{

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    page: number;

}



