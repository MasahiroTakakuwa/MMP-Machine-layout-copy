import { UserTokenController } from './token.controller';
import { UserToken } from '../entities/user-tokens.entity';
import { Position } from '../entities/position.entity';
import { LogsModule } from '../../master-logs/master-logs.module';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { UserTokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToken]),
    CommonModule,
    AuthModule,
    LogsModule,
    UserModule
  ],
  controllers: [UserTokenController],
  providers: [UserTokenService],
})
export class UserTokenModule {}
