import { Position } from './../entities/position.entity';
import { LogsModule } from '../../master-logs/master-logs.module';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position]),
    CommonModule,
    AuthModule,
    LogsModule,
    UserModule
  ],
  controllers: [PositionController],
  providers: [PositionService]
})
export class PositionModule {}
