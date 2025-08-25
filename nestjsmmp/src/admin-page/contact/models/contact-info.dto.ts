import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateContactInfoDto{

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    tel: string;

    facebook?: string;

    youtube?: string;

    



}