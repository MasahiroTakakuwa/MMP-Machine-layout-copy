import { LogsModule } from './../../master-logs/master-logs.module';
import { AuthModule } from './../auth/auth.module';
import { CommonModule } from './../common/common.module';

import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './models/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
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
