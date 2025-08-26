import { AbstractService } from '../common/abstract.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { Repository, getRepository } from 'typeorm';

@Injectable()
export class PermissionService extends AbstractService {
    constructor(
        @InjectRepository(Permission) private readonly permissionsRepository: Repository<Permission>
    ) {
        super(permissionsRepository);
    }
}
