import { LogsService } from './../../master-logs/master-logs.service';
import { PaginatedResult } from './../common/paginated-result.interface';
import { AbstractService } from '../common/abstract.service';
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { Raw, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UserService extends AbstractService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private authService: AuthService,
        private logsService: LogsService,
    ){
        super(userRepository);
        
    }
    

    async paginate(page = 1, relations = []): Promise<PaginatedResult> {

        const {data, meta} = await super.paginate(page, relations);

        return {
            data: data.map( user => {
                const {password, ...data} = user;
                return data;
            }),
            meta
        }
    }

    async find_fe(): Promise<any> {
        try{
            const usersfelist = await this.repository
                .createQueryBuilder('users')
                .innerJoinAndSelect ('users.department', 'department')
                .innerJoinAndSelect ('users.role', 'role')
                .where('department.name = :name', {name: 'Bảo Trì'})
                .getRawMany();
            return usersfelist
        }
        catch(err){
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async register_user(body, request: Request): Promise<User[]> {
        if(body.password !== body.password_confirm){
            throw new UnprocessableEntityException('PASSWORD DOES NOT MATCH', { cause: new Error(), description: 'PASSWORD DOES NOT MATCH' });
        }
        
        if(body.password.length < 6){
            throw new UnprocessableEntityException('PASSWORD HAS A MINIMUM 6 CHARACTERS', { cause: new Error(), description: 'PASSWORD HAS A MINIMUM 6 CHARACTERS' });
        }

        if(body.role === 1){
            throw new ForbiddenException('INSUFFICIENT AUTHORITY', { cause: new Error(), description: 'INSUFFICIENT AUTHORITY' });
        }
        
        body.password = await bcrypt.hash(body.password, 12);
        body.password_confirm = body.password;
        body.status = 'inactive';
        
        const resultRegister = await super.create(body);

        await this.logsService.create({
            ip_address: request.ip,
            action: 'Đăng ký tài khoản mới: ' + body.user_name,
            users: resultRegister.user_name,
        })

        return resultRegister;
    }

    async login_user(user_name: string, password: string, response : Response, request: Request): Promise<User[]> {
        let user = await super.findOne({user_name:user_name}, ['role', 'department']);
            
        if(!user){
            throw new UnauthorizedException('USERNAME NOT FOUND', { cause: new Error(), description: 'USERNAME NOT FOUND' });
        }

        if(user.status !== 'active'){
            throw new ForbiddenException('USERNAME IS NOT ACTIVED', { cause: new Error(), description: 'USERNAME IS NOT ACTIVED' });
        }

        if(!await bcrypt.compare(password, user.password)){
            throw new UnauthorizedException('INCORRECT PASSWORD', { cause: new Error(), description: 'INCORRECT PASSWORD' });
        }

        let permissions = [];
        if(user.role?.id === null || user.role?.id === undefined || user.department?.id === undefined || user.department?.id === null){
            permissions = [];
        }else{
            permissions = await super.queryPermission({roleId: user.role.id}, {departmentId: user.department.id});
        }
        
        const permissionIds = permissions.map(permission => [permission.permissionId, permission.permissionName, permission.permissionDescribe]);
        user = {
            ...user,
            permission: permissionIds
        };
        delete user.password;
        const jwt = await this.jwtService.signAsync({id:user.id});

        response.cookie('jwtmvpwebsite', jwt, {httpOnly:true});

        await this.logsService.create({
            ip_address: request.ip,
            action: 'Đăng nhập: ' + user_name,
            users: user_name,
        })

        return user;
    }

    async get_info(request: Request): Promise<User[]> {

        const id = await this.authService.userId(request)

        let user = await super.findOne({id}, ['role', 'department']);

        let permissions = [];
            if(user.role?.id === null || user.role?.id === undefined || user.department?.id === undefined || user.department?.id === null){
            permissions = [];
        }else{
            permissions = await super.queryPermission({roleId: user.role.id}, {departmentId: user.department.id});
        }
        const permissionIds = permissions.map(permission => [permission.permissionId, permission.permissionName, permission.permissionDescribe]);
        user = {
            ...user,
            permission: permissionIds
        };
        delete user.password;

        return user;
    }

    async logout_user(response: Response) {
        response.clearCookie('jwtmvpwebsite');
        return {
            message: 'LOGGED OUT',
        }
    }

    async master_create_user(body, request: Request): Promise<User> {
        try {
            const masterId = await this.authService.userId(request)
            let userMasterId = await super.findOne({id: masterId}, ['role', 'department']);

            const password = await bcrypt.hash('123456', 12);
            const status = 'active';
            const {...data} = body;
            const user_name = body.user_name;
            if(body.role === 1){
                throw new ForbiddenException('INSUFFICIENT AUTHORITY', { cause: new Error(), description: 'INSUFFICIENT AUTHORITY' });
            }
            await super.create({
                ...data,
                password,
                status
            });

            await this.logsService.create({
                ip_address: request.ip,
                action: 'Master tạo tài khoản: ' + user_name,
                users: userMasterId.user_name,
            })

            return super.findOne({user_name}, ['role', 'department']);
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async master_update_info(id: number, body, request: Request): Promise<User> {
        try {
            const masterId = await this.authService.userId(request)
            let userMasterId = await super.findOne({id: masterId}, ['role', 'department']);

            const {...data} = body;
            let user = await super.findOne({id}, ['role', 'department']);
            await super.update(id, {
                ...data
            })
            await this.logsService.create({
                ip_address: request.ip,
                action: 'Master cập nhật thông tin tài khoản: ' + user.user_name,
                users: userMasterId.user_name,
            })
            return await super.findOne({id}, ['role', 'department']);
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async master_reset_password(id: number, request: Request): Promise<User> {
        try {
            const masterId = await this.authService.userId(request)
            let userMasterId = await super.findOne({id: masterId}, ['role', 'department']);

            const password = await bcrypt.hash('123456', 12);
            let user = await super.findOne({id}, ['role', 'department']);
            await super.update(id, {
                password
            })
            await this.logsService.create({
                ip_address: request.ip,
                action: 'Master reset mật khẩu tài khoản: ' + user.user_name,
                users: userMasterId.user_name,
            })
            return await super.findOne({id}, ['role', 'department']);
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async master_delete_user(id: number, request: Request): Promise<User> {
        try {
            const masterId = await this.authService.userId(request);
            let user_master = await super.findOne({id: masterId}, ['role', 'department']);
            let user = await super.findOne({id}, ['role', 'department']);
            if(user.role.id === 1){
                throw new ForbiddenException('INSUFFICIENT AUTHORITY', { cause: new Error(), description: 'INSUFFICIENT AUTHORITY' });
            }
            await this.logsService.create({
                ip_address: request.ip,
                action: 'Master xóa tài khoản: ' + user.user_name,
                users: user_master.user_name,
            })
            return super.delete(id);
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async update_info(body, request: Request): Promise<User> {
        try {
            const id = await this.authService.userId(request);
            let user = await super.findOne({id}, ['role', 'department']);
            if(user.role.id !== 1){
                body.status = 'inactive';
            }
            await super.update(id,body);

            await this.logsService.create({
                ip_address: request.ip,
                action: 'Cập nhật thông tin cá nhân: ' + user.user_name,
                users: user.user_name,
            })

            return await super.findOne({id}, ['role', 'department']);
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async update_password(password_current: string, password: string, password_confirm: string, request: Request): Promise<User> {
        try {
            const id = await this.authService.userId(request);

            let user = await super.findOne({id:id});

            if(!await bcrypt.compare(password_current, user.password)){
                throw new BadRequestException('INVALID PASSWORD', { cause: new Error(), description: 'INVALID PASSWORD' });
            }

            if(password !== password_confirm){
                throw new BadRequestException('PASSWORD DOES NOT MATCH', { cause: new Error(), description: 'PASSWORD DOES NOT MATCH' });
            }
            
            const hashed = await bcrypt.hash(password, 12);
            await super.update(id,{
                password: hashed
            });

            await this.logsService.create({
                ip_address: request.ip,
                action: 'Cập nhật mật khẩu: ' + user.user_name,
                users: user.user_name,
            })
            return await super.findOne({id}, ['role', 'department']);
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async usersRoom(): Promise<User[]> {
        try {
            return await super.all()
            
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async update_info_role_department(body, request: Request): Promise<User> {
        try {
            const id = await this.authService.userId(request);
            let user = await super.findOne({id}, ['role', 'department']);
            if(body.role === 1 && user.role.id !== 1){
                throw new ForbiddenException('INSUFFICIENT AUTHORITY', { cause: new Error(), description: 'INSUFFICIENT AUTHORITY' });
            }
            if(user.role.id !== 1){
                body.status = 'inactive';
            }
            await super.update(id,body);
            // console.log(body);
            await this.logsService.create({
                ip_address: request.ip,
                action: 'Cập nhật thông tin cá nhân bộ phận | chức vụ: ' + user.user_name,
                users: user.user_name,
            })
            return await super.findOne({id}, ['role', 'department']);
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }
    
}
