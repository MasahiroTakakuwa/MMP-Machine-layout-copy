import { LogsService } from './../../master-logs/master-logs.service';
import { RoleDepartmentPermission } from './models/role_department_permission.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class DecentralizationService extends AbstractService{
    constructor(
        @InjectRepository(RoleDepartmentPermission) private readonly roleDepartmentPermissionRepository: Repository<RoleDepartmentPermission>,
        private authService: AuthService,
        private userService: UserService,
        private logsService: LogsService
    ) {
        super(roleDepartmentPermissionRepository);
    }

    async deleteDecentralization(role: number, department: number): Promise<any> {
        try{
            return await this.repository.delete({ role: role, department: department });
        }
        catch(err){
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async createPermission(role: number, department: number, permissions: number[], request: Request): Promise<any> {
        try {
            await this.deleteDecentralization(role, department);

            const id_user = await this.authService.userId(request)
            let user = await this.userService.findOne({id: id_user}, ['role', 'department']);
            await this.logsService.create({
                ip_address: request.ip,
                action: `Tạo phân quyền mới cho bộ phận: ${department} và chức vụ: ${role} có quyền: ${permissions}`,
                users: user.user_name,
            })
            const entities = permissions.map((permission) => ({
                role,
                department,
                permission: permission
            }));
    
            return await this.repository.save(entities);
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async deletePermission(id: number, request: Request): Promise<any> {
        try {
            const id_user = await this.authService.userId(request)
            let user = await this.userService.findOne({id: id_user}, ['role', 'department']);
    
            await this.logsService.create({
                ip_address: request.ip,
                action: `Xóa phân quyền tại id: ${id}`,
                users: user.user_name,
            })
            return super.delete(id);
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }
}
