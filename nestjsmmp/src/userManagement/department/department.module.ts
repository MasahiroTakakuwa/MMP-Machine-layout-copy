import { LogsModule } from './../../master-logs/master-logs.module';
import { AuthModule } from './../auth/auth.module';
import { CommonModule } from './../common/common.module';
import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './models/departments.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    CommonModule,
    AuthModule,
    LogsModule,
    UserModule
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService]
})
export class DepartmentModule {}
