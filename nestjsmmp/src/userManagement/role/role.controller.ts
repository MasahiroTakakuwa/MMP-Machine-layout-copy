import { AuthGuard } from './../auth/auth.guard';
import { HasPermission } from './../permission/has-permission.decorator';
import { Role } from './models/role.entity';
import { RoleService } from './role.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
@Controller('roles')
export class RoleController {

    constructor( 
            private roleService: RoleService,
        ){

    }
    //get all roles
    @Get()
    async all() {
        return this.roleService.all();
    }
    
    // Create a new role
    @Post()
    @HasPermission(4)
    @UseGuards(AuthGuard)
    async create(
        @Body('name') name : string,
        @Req() request: Request
    ): Promise<Role>{
        return await this.roleService.createRole(name, request);
    }
        
    // Get a role by id
    @Get(':id')
    @HasPermission(3)
    @UseGuards(AuthGuard)
    async get(@Param('id') id: number) {
        return this.roleService.findOne({id})
    }

    // Update a role by id
    @Put(':id')
    @HasPermission(4)
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: number,
        @Body('name') name : string,
        @Req() request: Request
    ): Promise<Role> {
        return await this.roleService.updateRole(id, name, request);
    }
    
    // Delete a role by id
    @Delete(':id')
    @HasPermission(4)
    @UseGuards(AuthGuard)
    async delete(
        @Param('id') id: number,
        @Req() request: Request
    ): Promise<Role>{
        return await this.roleService.deleteRole(id, request);
    }
}
