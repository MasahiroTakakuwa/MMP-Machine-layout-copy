import { AuthService } from './../auth/auth.service';
import { UserService } from './../user/user.service';
import { LogsService } from './../../master-logs/master-logs.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './models/role.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { Request } from 'express';

@Injectable()
export class RoleService extends AbstractService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        private logsService: LogsService,
        private userService: UserService,
        private authService: AuthService
    ){
        super(roleRepository);
    }

    async createRole(name: string, request: Request): Promise<Role> {
        try {
            const createRole = await super.create({
                name
            });
            const id = await this.authService.userId(request)
            let user = await this.userService.findOne({id}, ['role', 'department']);
    
            await this.logsService.create({
                ip_address: request.ip,
                action: 'Đăng ký chức vụ mới: ' + name,
                users: user.user_name,
            })
            return createRole
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async updateRole(id: number, name: string, request: Request): Promise<Role> {
        try {
            const roleOld = await super.findOne({id});
            const updateRole = await super.update(id, {name})

            const id_user = await this.authService.userId(request)
            let user = await this.userService.findOne({id: id_user}, ['role', 'department']);
            await this.logsService.create({
                ip_address: request.ip,
                action: `Sửa chức vụ: ${roleOld.name} sang ${name} tại role_id: ${id}` ,
                users: user.user_name,
            })
            return updateRole;
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async deleteRole(id: number, request: Request): Promise<Role> {
        try {
            const roleOld = await super.findOne({id});
            const id_user = await this.authService.userId(request)
            let user = await this.userService.findOne({id: id_user}, ['role', 'department']);
            await this.logsService.create({
                ip_address: request.ip,
                action: `Xóa chức vụ: ${roleOld.name} tại role_id: ${id}` ,
                users: user.user_name,
            })
            return await super.delete(id)
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }
}
