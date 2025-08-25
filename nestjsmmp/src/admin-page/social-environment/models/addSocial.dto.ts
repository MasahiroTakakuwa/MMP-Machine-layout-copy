import { IsNotEmpty } from "class-validator";

export class AddSocialDto{

    @IsNotEmpty()
    timeline ?: string;
    
    @IsNotEmpty()
    main_content ?: string;

    @IsNotEmpty()
    main_content_jp ?: string;

    @IsNotEmpty()
    data_img ?: string;

    @IsNotEmpty()
    data_img_jp ?: string;
}