import { LogsModule } from './../../master-logs/master-logs.module';
import { UserModule } from './../../userManagement/user/user.module';
import { AuthModule } from './../../userManagement/auth/auth.module';
import { CommonModule } from './../../userManagement/common/common.module';
import { Module } from '@nestjs/common';
import { SocialEnvironmentController } from './social-environment.controller';
import { SocialEnvironmentService } from './social-environment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Social } from './models/social.entity';
import { SocialTimeline } from './models/social_timeline.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Social, SocialTimeline]),
    CommonModule,
    AuthModule,
    UserModule,
    LogsModule,
  ],
  controllers: [SocialEnvironmentController],
  providers: [SocialEnvironmentService]
})
export class SocialEnvironmentModule {}
