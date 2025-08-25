export class UpdateSocialDto{
    id ?: number;
    
    timeline?: string;

    main_content?: string;

    main_content_jp: string;

    data: {
        content_img?: string;
        data ?: string[];
    }[];

    data_jp: {
        content_img?: string;
        data ?: string[];
    }[];

}