import { AbstractService } from '../common/abstract.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './models/permission.entity';
import { Repository, getRepository } from 'typeorm';

@Injectable()
export class PermissionService extends AbstractService {
    constructor(
        @InjectRepository(Permission) private readonly permissionsRepository: Repository<Permission>
    ) {
        super(permissionsRepository);

        // const fs = require('fs');
        // // Đọc dữ liệu từ tệp JSON
        // const rawData = fs.readFileSync('src/userManagement/permission/permissons-data.json');
        // const permissionsData = JSON.parse(rawData);
        // async function syncPermissionsFromJson() {
        //     try {
        //       for (const permissionData of permissionsData) {
        //         const permission = new Permission();
        //         permission.name = permissionData.name;
        //         permission.describe = permissionData.describe;
        //         await permissionsRepository.save(permission);
        //       }
          
        //         console.log('Dữ liệu phân quyền đã được đồng bộ thành công.');
        //     } catch (error) {
        //         console.log('Dữ liệu phân quyền đã có sẵn và đã được đồng bộ.');
        //     }
        // }
        // syncPermissionsFromJson();
    }

    

    
}
