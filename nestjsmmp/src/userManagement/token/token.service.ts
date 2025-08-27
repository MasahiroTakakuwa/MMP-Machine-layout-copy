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

    
}
