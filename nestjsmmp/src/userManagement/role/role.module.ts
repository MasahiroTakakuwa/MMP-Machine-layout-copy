import { Permission } from './../entities/permission.entity';
import { Role } from './../entities/role.entity';
import { LogsModule } from './../../master-logs/master-logs.module';
import { AuthModule } from './../auth/auth.module';
import { CommonModule } from './../common/common.module';

import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]),
    CommonModule,
    AuthModule,
    LogsModule,
    UserModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}
