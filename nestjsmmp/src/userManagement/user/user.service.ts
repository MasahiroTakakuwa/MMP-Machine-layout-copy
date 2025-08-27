import { ConfigService } from '@nestjs/config';
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
import { UserToken } from '../entities/user-tokens.entity';
@Injectable()
export class UserService extends AbstractService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
        @InjectRepository(Position) private readonly positionRepository: Repository<Position>,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(UserToken) private readonly userTokenRepository: Repository<UserToken>,
        private jwtService: JwtService,
        private authService: AuthService,
        private logsService: LogsService,
        private configService : ConfigService
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
    async createUser(dto: CreateUserDto): Promise<User> {
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
        const user = await super.findOne({id}, ['department', 'position', 'roles', 'roles.permissions']);
        if (!user) throw new NotFoundException(`User ID ${id} không tồn tại`);

        const permissions = [
            ...new Set(
                user.roles.flatMap(role => role.permissions.map(p => p.id))
            )
        ];
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

    private async hashToken(token: string) {
        // bcrypt or SHA-256; bcrypt adds salt — good for DB storage
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(token, salt);
    }

    private async compareTokenHash(token: string, hash: string) {
        return bcrypt.compare(token, hash);
    }

    async generateTokens(user: User) {
        const accessToken = await this.jwtService.signAsync(
        { sub: user.id },
        { expiresIn: '30m' }
        );
        const refreshToken = await this.jwtService.signAsync(
        { sub: user.id },
        { expiresIn: '7d' }
        );
        return { accessToken, refreshToken };
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

        const permissions = [
            ...new Set(
                user.roles.flatMap(role => role.permissions.map(p => p.id))
            )
        ];
        const { password: _, ...userWithoutPass } = user;

        // 🟢 Tạo JWT access token và refresh token
        const { accessToken, refreshToken } = await this.generateTokens(user);

        // hash refresh
        const tokenRefreshHash = await this.hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7d

        // Lưu refresh token đã hash vào DB
        await this.userTokenRepository.save(this.userTokenRepository.create({
            user: user,
            refresh_token: tokenRefreshHash,
            expired_at: expiresAt,
            ip_address: request.ip,
            user_agent: request.headers['user-agent'] || 'unknown',
        }));

        // Lưu refresh token vào cookie
        // set cookies (HttpOnly)
        response.cookie('jwtmmpmachinelayout', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 30 * 60 * 1000,
        })
        response.cookie('refresh_mmpmachinelayout', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            ...userWithoutPass,
            permissions,
            accessToken,
            refreshToken,
        };
    }

    // Refresh endpoint: xác thực refresh token, rotate
    async refreshTokens(response: Response, request: Request): Promise<{ accessToken: string; refreshToken: string }> {
        // 1) Lấy refresh token từ cookie
        const refreshToken = request.cookies['refresh_mmpmachinelayout'];
        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token provided');
        }

        // 2) Verify refresh JWT với refresh secret
        let payload: any;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'), // <== dùng secret refresh
            });
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const userId = Number(payload.sub); // bạn đã ký với { sub: user.id }
        const user = await this.findOne(userId);
        if (!user) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // 3) Tìm token của đúng user, chưa bị revoke
        const candidates = await this.userTokenRepository.find({
            where: { user: { id: userId }, revoked: false },
        });
        // 4) Tìm token khớp bằng cách compare hash + kiểm tra hết hạn DB
        let matched: any = null;
        const now = Date.now();

        for (const t of candidates) {
            // nếu đã quá hạn trong DB thì revoke luôn
            const expiredAt = t.expired_at ? new Date(t.expired_at) : null;
            if (expiredAt && expiredAt.getTime() <= now) {
                await this.userTokenRepository.update(t.id, { revoked: true });
                continue;
            }

            const same = await this.compareTokenHash(refreshToken, t.refresh_token); // bcrypt.compare
            if (same) {
                matched = t;
                break;
            }
        }

        // 5) Không tìm thấy token khớp -> detect reuse -> revoke toàn bộ session user
        if (!matched) {
            await this.userTokenRepository.update({ user: { id: userId } }, { revoked: true });
            throw new ForbiddenException('Refresh token reuse detected or invalid');
        }

        // 6) Rotation: revoke token cũ
        await this.userTokenRepository.update(matched.id, { revoked: true });

        // 7) Cấp cặp token mới
        const { accessToken, refreshToken: newRefresh } = await this.generateTokens(user);
        const newHash = await this.hashToken(newRefresh);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await this.userTokenRepository.save(
            this.userTokenRepository.create({
            user,
            refresh_token: newHash,
            expired_at: expiresAt,
            ip_address: request.ip,
            user_agent: request.headers['user-agent'] || 'unknown',
            }),
        );

        // 8) Set cookies mới
        response.cookie('jwtmmpmachinelayout', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 30 * 60 * 1000, // 30m
        });
        response.cookie('refresh_mmpmachinelayout', newRefresh, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
        });

        return { accessToken, refreshToken: newRefresh };
    }

    //Logout user
    async logoutUser(response: Response, request: Request): Promise<{ message: string }> {
        try {
            const refreshToken = request.cookies['refresh_mmpmachinelayout'];
            const id_user = await this.authService.userId(request);

            if (refreshToken) {
                const tokens = await this.userTokenRepository.find({
                    where: { user: { id: id_user }, revoked: false },
                });

                for (const t of tokens) {
                    if (await bcrypt.compare(refreshToken, t.refresh_token)) {
                        await this.userTokenRepository.update(t.id, { revoked: true });
                        break;
                    }
                }
            }

            // Clear cookies
            response.clearCookie('jwtmmpmachinelayout');
            response.clearCookie('refresh_mmpmachinelayout');

            return { message: 'Đăng xuất thành công' };
        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }


}
