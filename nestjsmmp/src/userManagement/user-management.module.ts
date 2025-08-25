import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { DepartmentModule } from './department/department.module';
import { DecentralizationModule } from './decentralization/decentralization.module';
import { UserModule } from './user/user.module';
import { PermissionGuard } from './permission/permission.guard';

@Module({
    imports: [
        AuthModule,
        CommonModule,
        RoleModule,
        PermissionModule,
        DepartmentModule,
        DecentralizationModule,
        UserModule,
    ],
    providers: [
        {
          provide: APP_GUARD,
          useClass: PermissionGuard
        }
      ],
})
export class UserManagementModule {}
