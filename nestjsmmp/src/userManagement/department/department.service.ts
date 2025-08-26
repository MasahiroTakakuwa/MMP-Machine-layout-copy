import { CreateDepartmentDto } from './models/create-department.dto';
import { Department } from './../entities/departments.entity';
import { AuthService } from './../auth/auth.service';
import { UserService } from './../user/user.service';
import { LogsService } from './../../master-logs/master-logs.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { UpdateDepartmentDto } from './models/update-department.dto';

@Injectable()
export class DepartmentService extends AbstractService{
    constructor(
        @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
        private logsService: LogsService,
        private userService: UserService,
        private authService: AuthService
    ){
        super(departmentRepository);
    }

    //Đăng ký bộ phận mới
    async createDepartment(dto: CreateDepartmentDto, request: Request): Promise<Department> {
        try {
            
            const id_user = await this.authService.userId(request)
            let user = await this.userService.findOne({id: id_user}, ['role', 'department']);
            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng.`);
            }
            const createDepartment = await super.create(dto);
            await this.logsService.create({
                ip_address: request.ip,
                action: 'Đăng ký bộ phận mới: ' + dto.name + ' - ' + dto.description,
                users: user.user_name,
            })
            return createDepartment;
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    //Lấy danh sách tất cả bộ phận
    async findAll(): Promise<Department[]> {
        return this.departmentRepository.find({ relations: ['users'] });
    }

    //Lấy thông tin bộ phận theo ID
    async findOne(id: number): Promise<Department> {
        const department = await this.departmentRepository.findOne({
        where: { id },
        relations: ['users'],
        });
        if (!department) {
        throw new NotFoundException(`Bộ phận tương ứng với ID:  ${id} không tìm thấy.`);
        }
        return department;
    }

    async updateDepartment(id: number, dto: UpdateDepartmentDto, request: Request): Promise<Department> {
        try {
            const department = await super.findOne({id});
            if (!department) {
                throw new NotFoundException(`Không tìm thấy bộ phận ID: ${id}`);
            }
            const updateDepartment = await super.update(id, dto);

            const id_user = await this.authService.userId(request)
            let user = await this.userService.findOne({id: id_user}, ['role', 'department']);
            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng.`);
            }
            await this.logsService.create({
                ip_address: request.ip,
                action: `Sửa bộ phận: ${department.name} - ${department.description} sang ${dto.name} - ${dto.description} tại ID: ${id}`,
                users: user.user_name,
            })
            return updateDepartment;
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async deleteDepartment(id: number, request: Request): Promise<Department> {
        try {
            const department = await super.findOne({id});
            if (!department) {
                throw new NotFoundException(`Không tìm thấy bộ phận ID: ${id}`);
            }
            const id_user = await this.authService.userId(request)
            let user = await this.userService.findOne({id: id_user}, ['role', 'department']);
            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng.`);
            }
            await this.logsService.create({
                ip_address: request.ip,
                action: `Xóa bộ phận: ${department.name} - ${department.description} tại ID: ${id}` ,
                users: user.user_name,
            })

            return super.delete(id);
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }
}
