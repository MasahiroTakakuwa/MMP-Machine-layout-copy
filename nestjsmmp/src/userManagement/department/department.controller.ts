import { AuthGuard } from './../auth/auth.guard';
import { DepartmentService } from './department.service';
import { HasPermission } from './../permission/has-permission.decorator';
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { Department } from './models/departments.entity';

@Controller('departments')
export class DepartmentController {
    constructor (
            private departmentService: DepartmentService
        ){}

    //Get all departments
    @Get()
    async all() {
        return this.departmentService.all();
    }

    // Create a new department
    @Post()
    @HasPermission(6)
    @UseGuards(AuthGuard)
    async create(
        @Body('name') name : string,
        @Req() request: Request
    ): Promise<Department>{
        return await this.departmentService.createDepartment(name, request);
    }
        
    // Get a department by id
    @Get(':id')
    @HasPermission(5)
    @UseGuards(AuthGuard)
    async get(@Param('id') id: number) {
        return this.departmentService.findOne({id})
    }

    //update a department by id
    @Put(':id')
    @HasPermission(6)
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: number,
        @Body('name') name : string,
        @Req() request: Request
    ): Promise<Department>{
        return await this.departmentService.updateDepartment(id, name, request);
    }
    
    //Delete a department by id
    @Delete(':id')
    @HasPermission(6)
    @UseGuards(AuthGuard)
    async delete(
        @Param('id') id: number,
        @Req() request: Request
        ):Promise<Department> {
        return this.departmentService.deleteDepartment(id, request);
    }

}
