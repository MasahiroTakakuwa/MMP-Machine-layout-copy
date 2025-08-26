import { Department } from '../entities/departments.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UserTokenService } from './token.service';
import { HasPermission } from '../permission/has-permission.decorator';
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';


@Controller('user-tokens')
export class UserTokenController {
    constructor (
            private userTokenService: UserTokenService
        ){}

    //Get all departments
    @Get()
    async all() {
        return this.userTokenService.all();
    }

    // Create a new department
    // @Post()
    // @HasPermission(6)
    // @UseGuards(AuthGuard)
    // async create(
    //     @Body('name') name : string,
    //     @Req() request: Request
    // ): Promise<Department>{
    //     return await this.positionService.createDepartment(name, request);
    // }
        
    // // Get a department by id
    // @Get(':id')
    // @HasPermission(5)
    // @UseGuards(AuthGuard)
    // async get(@Param('id') id: number) {
    //     return this.positionService.findOne({id})
    // }

    // //update a department by id
    // @Put(':id')
    // @HasPermission(6)
    // @UseGuards(AuthGuard)
    // async update(
    //     @Param('id') id: number,
    //     @Body('name') name : string,
    //     @Req() request: Request
    // ): Promise<Department>{
    //     return await this.positionService.updateDepartment(id, name, request);
    // }
    
    // //Delete a department by id
    // @Delete(':id')
    // @HasPermission(6)
    // @UseGuards(AuthGuard)
    // async delete(
    //     @Param('id') id: number,
    //     @Req() request: Request
    //     ):Promise<Department> {
    //     return this.positionService.deleteDepartment(id, request);
    // }

}
