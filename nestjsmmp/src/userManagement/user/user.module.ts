import { UserToken } from './../entities/user-tokens.entity';
import { Role } from './../entities/role.entity';
import { Position } from './../entities/position.entity';
import { Department } from './../entities/departments.entity';
import { LogsModule } from './../../master-logs/master-logs.module';
import { AuthModule } from './../auth/auth.module';
import { CommonModule } from './../common/common.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Department, Position, Role, UserToken]),
    CommonModule,
    AuthModule,
    LogsModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule.forFeature([User])]
})
export class UserModule {

}
