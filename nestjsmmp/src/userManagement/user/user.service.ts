import { UpdateUserDto } from './models/update-user.dto';
import { Role } from './../entities/role.entity';
import { Position } from './../entities/position.entity';
import { Department } from './../entities/departments.entity';
import { CreateUserDto } from './models/create-user.dto';
import { LogsService } from './../../master-logs/master-logs.service';
import { PaginatedResult } from './../common/paginated-result.interface';
import { AbstractService } from '../common/abstract.service';
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { In, Raw, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UserService extends AbstractService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
        @InjectRepository(Position) private readonly positionRepository: Repository<Position>,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
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

    //Tạo mới user
    async createUser(dto: CreateUserDto, request: Request): Promise<User> {
        try {

            if(dto.password.length < 6){
                throw new UnprocessableEntityException('PASSWORD HAS A MINIMUM 6 CHARACTERS', { cause: new Error(), description: 'PASSWORD HAS A MINIMUM 6 CHARACTERS' });
            }

            //Kiểm tra password có trùng nhau không
            if(dto.password !== dto.password_confirm){
                throw new UnprocessableEntityException('PASSWORD DOES NOT MATCH', { cause: new Error(), description: 'PASSWORD DOES NOT MATCH' });
            }

            dto.password = await bcrypt.hash(dto.password, 12);
            dto.password_confirm = dto.password;
            dto.status = 'inactive';

            const department = dto.departmentId
                ? await this.departmentRepository.findOne({ where: { id: dto.departmentId } })
                : null;

            const position = dto.positionId
                ? await this.positionRepository.findOne({ where: { id: dto.positionId } })
                : null;

            const roles = dto.roleIds?.length
                ? await this.roleRepository.find({ where: { id: In(dto.roleIds) } })
                : [];

            const newUser = this.userRepository.create({
                user_name: dto.user_name,
                first_name: dto.first_name,
                last_name: dto.last_name,
                email: dto.email,
                password: dto.password,
                phone_number: dto.phone_number,
                avatar: dto.avatar,
                status: dto.status,
                department,
                position,
                roles,
            });

            const resultRegister = await super.create(newUser);

            // Log
            const id_user = await this.authService.userId(request);
            let actor = await this.userRepository.findOne({ where: { id: id_user } });
            await this.logsService.create({
                ip_address: request.ip,
                action: `Tạo mới user: ${dto.user_name} - ${dto.email}`,
                users: actor ? actor.user_name : 'system',
            });
            return resultRegister;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    //Lấy danh sách tất cả user
    async findAll(): Promise<User[]> {
        return super.find({
        relations: ['department', 'position', 'roles', 'roles.permissions'],
        });
    }

    //Lấy thông tin user theo ID
    async findOne(id: number): Promise<User> {
        const user = await super.findOne({
        where: { id },
        relations: ['department', 'position', 'roles', 'roles.permissions'],
        });
        if (!user) throw new NotFoundException(`User ID ${id} không tồn tại`);

        const permissionsSet = new Map<
            number,
            { id: number; name: string; description: string }
        >();

        user.roles.forEach((role) => {
            role.permissions.forEach((permission) => {
            permissionsSet.set(permission.id, {
                id: permission.id,
                name: permission.name,
                description: permission.description,
            });
            });
        });
        //Lấy danh sách phân quyền từ roles không trùng lặp
        
        const permissions = Array.from(permissionsSet.values());
        const { password: _, ...userWithoutPass } = user;

        return {
            ...userWithoutPass,
            permissions,
        };
    }

    //Lấy thông tin user theo request
    async findOneRequest(request:Request): Promise<User> {
        const id_user = await this.authService.userId(request);
        const user = await this.findOne(id_user);
        if (!user) throw new NotFoundException(`User ID ${id_user} không tồn tại`);
        return user;
    }

    async updateUser(id: number, dto: UpdateUserDto, request: Request): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException(`User ID ${id} không tồn tại`);
        }
        if (dto.departmentId) {
        user.department = await this.departmentRepository.findOne({
            where: { id: dto.departmentId },
        });
        }
        if (dto.positionId) {
        user.position = await this.positionRepository.findOne({
            where: { id: dto.positionId },
        });
        }
        if (dto.roleIds?.length) {
        user.roles = await this.roleRepository.find({
            where: { id: In(dto.roleIds) },
        });
        }

        user.first_name = dto.first_name ?? user.first_name;
        user.last_name = dto.last_name ?? user.last_name;
        user.email = dto.email ?? user.email;
        user.phone_number = dto.phone_number ?? user.phone_number;
        user.avatar = dto.avatar ?? user.avatar;
        user.status = dto.status ?? user.status;

        await this.userRepository.save(user);

        // log
        const id_user = await this.authService.userId(request);
        let actor = await this.userRepository.findOne({ where: { id: id_user } });
        await this.logsService.create({
        ip_address: request.ip,
        action: `Cập nhật user ID: ${id}`,
        users: actor ? actor.user_name : 'system',
        });

        return user;
    }

    async changePassword(id: number, newPassword: string, newPasswordConfirm: string, request: Request): Promise<User> {
        try {
            const user = await this.findOne(id);
            if (!user) {
                throw new NotFoundException(`User ID ${id} không tồn tại`);
            }
            if(!await bcrypt.compare(newPassword, user.password)){
                throw new BadRequestException('INVALID PASSWORD', { cause: new Error(), description: 'INVALID PASSWORD' });
            }

            if(newPassword !== newPasswordConfirm){
                throw new BadRequestException('PASSWORD DOES NOT MATCH', { cause: new Error(), description: 'PASSWORD DOES NOT MATCH' });
            }

            const hashed = await bcrypt.hash(newPassword, 12);
            await super.update(id,{
                password: hashed
            });
            //log
            const id_user = await this.authService.userId(request);
            let actor = await this.userRepository.findOne({ where: { id: id_user } });
            await this.logsService.create({
                ip_address: request.ip,
                action: 'Cập nhật mật khẩu: ' + user.user_name,
                users: actor ? actor.user_name : 'system',
            })
            return await super.findOne({id}, ['department', 'position', 'roles']);
        }
        catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    //Xóa user
    async remove(id: number, request: Request): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException(`User ID ${id} không tồn tại`);
        }
        await this.userRepository.remove(user);

        const id_user = await this.authService.userId(request);
        let actor = await this.userRepository.findOne({ where: { id: id_user } });
        await this.logsService.create({
        ip_address: request.ip,
        action: `Xóa user: ${user.user_name} - ${user.email}`,
        users: actor ? actor.user_name : 'system',
        });

        return user;
    }

    async loginUser(user_name: string, password: string, response : Response, request: Request): Promise<User> {
        let user = await super.findOne({user_name:user_name}, ['department', 'position', 'roles', 'roles.permissions']);
            
        if(!user){
            throw new UnauthorizedException('USERNAME NOT FOUND', { cause: new Error(), description: 'USERNAME NOT FOUND' });
        }

        if(user.status !== 'active'){
            throw new ForbiddenException('USERNAME IS NOT ACTIVED', { cause: new Error(), description: 'USERNAME IS NOT ACTIVED' });
        }

        if(!await bcrypt.compare(password, user.password)){
            throw new UnauthorizedException('INCORRECT PASSWORD', { cause: new Error(), description: 'INCORRECT PASSWORD' });
        }

        const permissionsSet = new Map<
            number,
            { id: number; name: string; description: string }
        >();

        user.roles.forEach((role) => {
            role.permissions.forEach((permission) => {
            permissionsSet.set(permission.id, {
                id: permission.id,
                name: permission.name,
                description: permission.description,
            });
            });
        });
        //Lấy danh sách phân quyền từ roles không trùng lặp
        
        const permissions = Array.from(permissionsSet.values());
        const { password: _, ...userWithoutPass } = user;

        // 🟢 Tạo JWT access token
        const accessToken = await this.jwtService.signAsync({ id: user.id });

        // 🟢 (tuỳ chọn) Tạo refresh token
        const refreshToken = await this.jwtService.signAsync(
            { id: user.id },
            { expiresIn: '7d' },
        );

        // Lưu refresh token vào cookie
        response.cookie('jwtmmpmachinelayout', accessToken, { httpOnly: true });
        response.cookie('refresh_mmpmachinelayout', refreshToken, { httpOnly: true });

        return {
            ...userWithoutPass,
            permissions,
            accessToken,
            refreshToken,
        };
    }

    //Logout user
    async logoutUser(response: Response): Promise<{ message: string }> {
    try {
        // const id_user = await this.authService.userId(request);
        // let user = await super.findOne({ id: id_user }, ['department', 'position', 'roles']);

        // if (!user) {
        //     throw new UnauthorizedException('USER NOT FOUND');
        // }

        // Xoá cookie JWT
        response.clearCookie('jwtmvpwebsite');

        // (Optional) Nếu bạn lưu refresh token trong DB thì xoá nó
        // await this.userTokenRepository.delete({ user: { id: id_user } });

        // Ghi log
        // await this.logsService.create({
        //     ip_address: request.ip,
        //     action: `Đăng xuất tài khoản: ${user.user_name}`,
        //     users: user.user_name,
        // });

        return { message: 'Logout successful' };
    } catch (err) {
        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
    }
}

}
