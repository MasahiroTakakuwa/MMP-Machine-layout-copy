import { IsNotEmpty } from "class-validator"

export class EditResearchDevelopmentItemContentDto{

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    page: number;

    content?: string;

    describe?: string;

    content_jp?: string;

    describe_jp?: string;
}


