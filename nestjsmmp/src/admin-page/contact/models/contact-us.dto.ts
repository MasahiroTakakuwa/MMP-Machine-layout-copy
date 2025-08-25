import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class ContactUsDto{

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
    phone: string;

    



}