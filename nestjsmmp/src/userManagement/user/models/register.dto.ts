import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto{

    @IsNotEmpty()
    user_name: string;

    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    password_confirm: string;

    @IsNotEmpty()
    role: number;

    @IsNotEmpty()
    department: number;

    phone_number: string;

    avatar: string;

    telegram: string;

    status: string;

}