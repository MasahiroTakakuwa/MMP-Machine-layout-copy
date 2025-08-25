import { IsNotEmpty } from "class-validator";

export class EditContactInfoDto{

    @IsNotEmpty()
    id: number; 

    name?: string;

    email?: string;

    subject?: string;

    message?: string;

    phone?: string;

    status?: string;
}