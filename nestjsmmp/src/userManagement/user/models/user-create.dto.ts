import { IsEmail, IsNotEmpty } from "class-validator";

export class UserCreateDto{

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
    role: number;

    @IsNotEmpty()
    department: number;

    phone_number: string;

    avatar: string;

    telegram: string;

    status: string;
}