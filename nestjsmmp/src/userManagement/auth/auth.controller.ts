import { RegisterDto } from './../user/models/register.dto';
import { UserService } from './../user/user.service';
import { Body, Controller, Post, Res, Get, Req, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { User } from '../user/models/users.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
    constructor(
        private userService: UserService,
        ) {
    }

    // Register a user
    @Post('register')
    async register(
            @Body() body: RegisterDto,
            @Req() request: Request
        ): Promise<User[]> {
        return this.userService.register_user(body, request);
    }

    //Login with user
    @Post('login')
    async login(
        @Body('user_name') user_name:string,
        @Body('password') password:string,
        @Res({passthrough:true}) response : Response,
        @Req() request: Request
        ): Promise<User[]> {
            return this.userService.login_user(user_name, password, response, request);
            
    }

    //Get info user by token
    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request){
        return this.userService.get_info(request);
    }


    //Logout
    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(
        @Res({passthrough:true}) response: Response,
    ){
        return this.userService.logout_user(response);
    }
}
