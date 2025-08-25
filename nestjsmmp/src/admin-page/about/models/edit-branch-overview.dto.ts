import { IsNotEmpty } from "class-validator"

export class EditBranchOverview{

    @IsNotEmpty()
    id: number;

    describe?: string;

    content?: string;

    content_jp?: string;
    
    img?: string;

    img_jp?: string;
}

