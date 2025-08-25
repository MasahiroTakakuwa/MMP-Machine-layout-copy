import { IsNotEmpty } from "class-validator";

export class EditResponseCapacityItemContentDto{

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    page: number;

    describe?: string;

    content?: string;

    describe_jp?: string;

    content_jp?: string;

}



