import { LogsModule } from './../../master-logs/master-logs.module';
import { UserModule } from './../../userManagement/user/user.module';
import { AuthModule } from './../../userManagement/auth/auth.module';
import { CommonModule } from './../../userManagement/common/common.module';
import { Module } from '@nestjs/common';
import { QualityService } from './quality.service';
import { QualityController } from './quality.controller';
import { QualityPageEntity } from './models/quality.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([QualityPageEntity]),
    CommonModule,
    AuthModule,
    UserModule,
    LogsModule,
  ],
  providers: [QualityService],
  controllers: [QualityController]
})
export class QualityModule {}
