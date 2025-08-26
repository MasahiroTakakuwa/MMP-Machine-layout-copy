import { UpdatePositionDto } from './models/update-position.dto';
import { CreatePositionDto } from './models/create-position.dto';
import { Position } from './../entities/position.entity';
import { Department } from '../entities/departments.entity';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { LogsService } from '../../master-logs/master-logs.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class PositionService extends AbstractService{
    constructor(
        @InjectRepository(Position) private readonly positionRepository: Repository<Position>,
        private logsService: LogsService,
        private userService: UserService,
        private authService: AuthService
    ){
        super(positionRepository);
    }

    //Đăng ký chức vụ mới
    async createPosition(dto: CreatePositionDto, request: Request): Promise<Position> {
        try {
        const id_user = await this.authService.userId(request);
        let user = await this.userService.findOne(id_user );
        if (!user) {
            throw new NotFoundException(`Không tìm thấy người dùng.`);
        }
        const newPosition = await super.create(dto);
        await this.logsService.create({
            ip_address: request.ip,
            action: `Đăng ký chức vụ mới: ${dto.name} - ${dto.description}`,
            users: user.user_name,
        });
        return newPosition;
        } catch (err) {
        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    //Lấy danh sách tất cả chức vụ
    async findAll(): Promise<Position[]> {
        return this.positionRepository.find({ relations: ['users'] });
    }

    //Lấy thông tin chức vụ theo ID
    async findOne(id: number): Promise<Position> {
        const position = await this.positionRepository.findOne({
        where: { id },
        relations: ['users'],
        });

        if (!position) {
        throw new NotFoundException(`Chức vụ với ID ${id} không tồn tại`);
        }

        return position;
    }

    // Cập nhật chức vụ theo ID
    async updatePosition(id: number, dto: UpdatePositionDto, request: Request): Promise<Position> {
        try {
        const position = await super.findOne({ id });
        if (!position) {
            throw new NotFoundException(`Chức vụ với ID ${id} không tồn tại`);
        }

        const id_user = await this.authService.userId(request);
        let user = await this.userService.findOne(id_user );
        if (!user) {
            throw new NotFoundException(`Không tìm thấy người dùng.`);
        }

        const updatedPosition = await super.update(id, dto);
        await this.logsService.create({
            ip_address: request.ip,
            action: `Sửa chức vụ: ${position.name} - ${position.description} → ${dto.name} - ${dto.description} tại ID: ${id}`,
            users: user.user_name,
        });

        return updatedPosition;
        } catch (err) {
        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async deletePosition(id: number, request: Request): Promise<Position> {
        try {
        const position = await super.findOne({ id });
        if (!position) {
            throw new NotFoundException(`Chức vụ với ID ${id} không tồn tại`);
        }
        const id_user = await this.authService.userId(request);
        let user = await this.userService.findOne(id_user );
        if (!user) {
            throw new NotFoundException(`Không tìm thấy người dùng.`);
        }
        await this.logsService.create({
            ip_address: request.ip,
            action: `Xóa chức vụ: ${position.name} - ${position.description} tại ID: ${id}`,
            users: user.user_name,
        });

        return super.delete(id);
        } catch (err) {
        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }
}
