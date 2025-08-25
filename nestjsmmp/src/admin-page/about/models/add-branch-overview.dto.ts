import { IsNotEmpty } from "class-validator"

export class ContentBranchOverview{

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    address: string;

    link?: string;

    @IsNotEmpty()
    tel: string;

    @IsNotEmpty()
    fax: string;

    @IsNotEmpty()
    capital: string;

    
}

export class AddBranchOverview{

    @IsNotEmpty()
    describe: string;

    @IsNotEmpty()
    content: ContentBranchOverview;

    @IsNotEmpty()
    content_jp: ContentBranchOverview;
    
}

