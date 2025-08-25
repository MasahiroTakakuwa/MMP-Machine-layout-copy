import { LogsModule } from './../../master-logs/master-logs.module';
import { UserModule } from './../../userManagement/user/user.module';
import { AuthModule } from './../../userManagement/auth/auth.module';
import { CommonModule } from './../../userManagement/common/common.module';
import { Module } from '@nestjs/common';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentService } from './recruitment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from './models/jobs.entity';
import { JobsDescription } from './models/jobs-decription.entity';
import { CategoryJob } from './models/categoryJob.entity';
import { RecruitmentEmail } from './models/emailRegister.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jobs, JobsDescription, CategoryJob, RecruitmentEmail]),
    CommonModule,
    AuthModule,
    UserModule,
    LogsModule,
  ],
  controllers: [RecruitmentController],
  providers: [RecruitmentService]
})
export class RecruitmentModule {}
