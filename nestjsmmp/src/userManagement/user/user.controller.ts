import { HasPermission } from './../permission/has-permission.decorator';
import { AuthService } from './../auth/auth.service';
import { AuthGuard } from './../auth/auth.guard';
import { User } from '../entities/users.entity';
import { UserService } from './user.service';
import { Controller, Get, Post, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards, Param, Put, Delete, Req } from '@nestjs/common';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(
        private userService : UserService,
        private authService : AuthService
        ){

    }

    //Get all users
    @Get()
    @HasPermission(1)
    async all(){
        return await this.userService.all(['role', 'department']);
    }

    // // Create users
    // @Post()
    // @HasPermission(2)
    // async create(
    //         @Body() body: UserCreateDto,
    //         @Req() request: Request
    //     ): Promise<User> {
    //     return this.userService.master_create_user(body, request);
    // }

    // // Get users by id
    // @Get(':id')
    // @HasPermission(1)
    // async get(@Param('id') id: number) {
    //     return this.userService.findOne({id}, ['role', 'department']);
    // }

    // // update info user in profile
    // @Put('info')
    // async updateInfo(
    //     @Body() body: UserUpdateDto,
    //     @Req() request: Request
    // ): Promise<User>{
    //     return await this.userService.update_info(body, request);
    // } 

    // // update pw user in profile
    // @Put('password')
    // async updatePassword(
    //     @Body('password_current') password_current: string,
    //     @Body('password') password: string,
    //     @Body('password_confirm') password_confirm: string,
    //     @Req() request: Request
    // ): Promise<User>{
    //     return this.userService.update_password(password_current, password, password_confirm, request)
    // } 
    
    // // update info user by id
    // @Put(':id')
    // @HasPermission(2)
    // async update(
    //     @Param('id') id: number,
    //     @Body() body: UserUpdateDto,
    //     @Req() request: Request
    // ): Promise<User>{
    //     return await this.userService.master_update_info(id, body, request);
    // }

    // //reset password by id
    // @Put('reset/:id')
    // @HasPermission(2)
    // async resetPassword(
    //     @Param('id') id: number,
    //     @Req() request: Request
    // ):Promise<User>{
    //     return await this.userService.master_reset_password(id, request);
    // }
    
    // // Delete user by id
    // @Delete(':id')
    // @HasPermission(2)
    // async delete(
    //         @Param('id') id: number,
    //         @Req() request: Request
    //     ):Promise<User> {
    //     return await this.userService.master_delete_user(id, request);
    // }

    // //get user fe
    // @Get('users-list/fe')
    // async getFeUsers(){
    //     return await this.userService.find_fe();
    // }

    // // update role and department user in profile
    // @Put('edit/role-department')
    // async updateInfoRoleOrDepartment(
    //     @Body() body: UserUpdateRoleOrDepartmentDto,
    //     @Req() request: Request
    // ): Promise<User>{
    //     return await this.userService.update_info_role_department(body, request);
    // } 

}
