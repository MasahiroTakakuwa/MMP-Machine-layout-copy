import { LogsModule } from './../../master-logs/master-logs.module';
import { AuthModule } from './../auth/auth.module';
import { CommonModule } from './../common/common.module';
import { RoleDepartmentPermission } from './models/role_department_permission.entity';
import { Module } from '@nestjs/common';
import { DecentralizationController } from './decentralization.controller';
import { DecentralizationService } from './decentralization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleDepartmentPermission]),
    CommonModule,
    AuthModule,
    UserModule,
    LogsModule
  ],
  controllers: [DecentralizationController],
  providers: [DecentralizationService]
})
export class DecentralizationModule {}
