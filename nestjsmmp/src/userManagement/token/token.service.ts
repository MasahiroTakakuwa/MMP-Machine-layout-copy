import { UserToken } from './../entities/user-tokens.entity';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { LogsService } from '../../master-logs/master-logs.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class UserTokenService extends AbstractService{
    constructor(
        @InjectRepository(UserToken) private readonly userTokenRepository: Repository<UserToken>,
        private logsService: LogsService,
        private userService: UserService,
        private authService: AuthService
    ){
        super(userTokenRepository);
    }

    // async createDepartment(name: string, request: Request): Promise<Department> {
    //     try {
            
    //         const createDepartment = await super.create({name});
    //         const id_user = await this.authService.userId(request)
    //         let user = await this.userService.findOne({id: id_user}, ['role', 'department']);
    
    //         await this.logsService.create({
    //             ip_address: request.ip,
    //             action: 'Đăng ký bộ phận mới: ' + name,
    //             users: user.user_name,
    //         })
    //         return createDepartment;
    //     } catch (err) {
    //         throw new InternalServerErrorException(err, { cause: new Error(), description: err });
    //     }
    // }

    // async updateDepartment(id: number, name: string, request: Request): Promise<Department> {
    //     try {
    //         const departmentOld = await super.findOne({id});
    //         const updateDepartment = await super.update(id, {name});

    //         const id_user = await this.authService.userId(request)
    //         let user = await this.userService.findOne({id: id_user}, ['role', 'department']);

    //         await this.logsService.create({
    //             ip_address: request.ip,
    //             action: `Sửa bộ phận: ${departmentOld.name} sang ${name} tại department_id: ${id}`,
    //             users: user.user_name,
    //         })
    //         return updateDepartment;
    //     } catch (err) {
    //         throw new InternalServerErrorException(err, { cause: new Error(), description: err });
    //     }
    // }

    // async deleteDepartment(id: number, request: Request): Promise<Department> {
    //     try {
    //         const departmentOld = await super.findOne({id});

    //         const id_user = await this.authService.userId(request)
    //         let user = await this.userService.findOne({id: id_user}, ['role', 'department']);
    //         await this.logsService.create({
    //             ip_address: request.ip,
    //             action: `Xóa bộ phận: ${departmentOld.name} tại department_id: ${id}` ,
    //             users: user.user_name,
    //         })

    //         return super.delete(id);
    //     } catch (err) {
    //         throw new InternalServerErrorException(err, { cause: new Error(), description: err });
    //     }
    // }
}
