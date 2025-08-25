import { HasPermission } from './../permission/has-permission.decorator';
import { AuthGuard } from './../auth/auth.guard';
import { DecentralizationService } from './decentralization.service';
import { Body, Controller, Delete, Get, Param, UseGuards, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { RoleDepartmentPermission } from './models/role_department_permission.entity';
@UseGuards(AuthGuard)
@Controller('decentralizations')
export class DecentralizationController {
    constructor (
            private decentralizationService: DecentralizationService,
        ){}

    //Get all permissions by roleId and departmentId
    @Get(':roleId/:departmentId')
    @HasPermission(7)
    async all(
        @Param('roleId') roleId: number,
        @Param('departmentId') departmentId: number,
    ) : Promise<RoleDepartmentPermission>{
        return this.decentralizationService.queryPermission({roleId}, {departmentId});
    }

    // Create permissions for roleId and departmentId
    @Post()
    @HasPermission(8)
    async createPermissions(
        @Body('roleId') role:number,
        @Body('departmentId') department:number,
        @Body('permissionsId') permissions : number[],
        @Req() request: Request
    ): Promise<RoleDepartmentPermission>{
        return await this.decentralizationService.createPermission(role, department, permissions, request)
    }

    // Delete permissions by id
    @Delete(':id')
    @HasPermission(8)
    async delete(
        @Param('id') id: number,
        @Req() request: Request
    ) : Promise<RoleDepartmentPermission>{
        return this.decentralizationService.deletePermission(id, request);
    }
}
