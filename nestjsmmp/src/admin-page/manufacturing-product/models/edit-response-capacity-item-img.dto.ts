import { IsNotEmpty } from "class-validator"

export class EditResponseCapacityItemImgDto{

    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    page: number;

}

