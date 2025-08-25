import { IsNotEmpty } from "class-validator";

export class AddResponseCapacityItem{

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    describe: string;

    @IsNotEmpty()
    describe_jp: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    content_jp: string;
}



