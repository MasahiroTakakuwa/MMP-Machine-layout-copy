import { UpdateRoleDto } from './models/update-role.dto';
import { CreateRoleDto } from './models/create-role.dto';
import { Permission } from './../entities/permission.entity';
import { Role } from './../entities/role.entity';
import { AuthService } from './../auth/auth.service';
import { UserService } from './../user/user.service';
import { LogsService } from './../../master-logs/master-logs.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { Request } from 'express';

@Injectable()
export class RoleService extends AbstractService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
        private logsService: LogsService,
        private userService: UserService,
        private authService: AuthService
    ){
        super(roleRepository);
    }

    // async createRole(name: string, request: Request): Promise<Role> {
    //     try {
    //         const createRole = await super.create({
    //             name
    //         });
    //         const id = await this.authService.userId(request)
    //         let user = await this.userService.findOne({id}, ['role', 'department']);
    
    //         await this.logsService.create({
    //             ip_address: request.ip,
    //             action: 'Đăng ký chức vụ mới: ' + name,
    //             users: user.user_name,
    //         })
    //         return createRole
    //     } catch (err) {
    //         throw new InternalServerErrorException(err, { cause: new Error(), description: err });
    //     }
    // }

    //Đăng ký vai trò và danh sách quyền mới
    async createRole(dto: CreateRoleDto, request: Request): Promise<Role> {
        try {
            const id_user = await this.authService.userId(request);
            let user = await this.userService.findOne({ id: id_user }, ['role', 'department']);
            if (!user) {
                throw new InternalServerErrorException(`Không tìm thấy người dùng.`);
            }

            let permissions = [];
            if (dto.permissionIds && dto.permissionIds.length > 0) {
                permissions = await this.permissionRepository.find({
                    where: { id: In(dto.permissionIds) },
                });
            }
            const newRole = this.roleRepository.create({
                name: dto.name,
                description: dto.description,
                permissions,
            });
            await this.roleRepository.save(newRole);
            await this.logsService.create({
                ip_address: request.ip,
                action: `Tạo mới role: ${dto.name} - ${dto.description}`,
                users: user.user_name,
            });
            return newRole;
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    //Lấy danh sách tất cả vai trò và các quyền liên quan
    async findAll(): Promise<Role[]> {
        return this.roleRepository.find({ relations: ['users', 'permissions'] });
    }

    //Lấy thông tin vai trò theo ID
    async findOne(id: number): Promise<Role> {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['users', 'permissions'],
        });
        if (!role) {
        throw new NotFoundException(`Role với ID ${id} không tồn tại`);
        }
        return role;
    }

    //Cập nhật vai trò và danh sách quyền
    async updateRole(id: number, dto: UpdateRoleDto, request: Request): Promise<Role> {
        try {

            const id_user = await this.authService.userId(request);
            let user = await this.userService.findOne({ id: id_user }, ['role', 'department']);
            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng.`);
            }

            const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
            if (!role) throw new NotFoundException(`Role với ID ${id} không tồn tại`);

            let permissions = [];
            if (dto.permissionIds && dto.permissionIds.length > 0) {
                permissions = await this.permissionRepository.find({
                where: { id: In(dto.permissionIds) },
                });
            }

            role.name = dto.name ?? role.name;
            role.description = dto.description ?? role.description;
            role.permissions = permissions.length > 0 ? permissions : role.permissions;

            await this.roleRepository.save(role);

            await this.logsService.create({
                ip_address: request.ip,
                action: `Cập nhật role ID: ${id} → ${dto.name ?? role.name}`,
                users: user.user_name,
            });

            return role;
        } catch (err) {
        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async deleteRole(id: number, request: Request): Promise<Role> {
        try {
            const id_user = await this.authService.userId(request);
            let user = await this.userService.findOne({ id: id_user }, ['role', 'department']);
            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng.`);
            }

            const role = await super.findOne({ id });
            if (!role) {
                throw new NotFoundException(`Không tìm thấy role ID: ${id}`);
            }
            
            await this.logsService.create({
                ip_address: request.ip,
                action: `Xóa role: ${role.name} - ${role.description} tại ID: ${id}`,
                users: user.user_name,
            });

            return super.delete(id);
        } catch (err) {
        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }
}
