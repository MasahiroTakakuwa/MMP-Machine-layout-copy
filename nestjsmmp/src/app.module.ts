import { Module } from '@nestjs/common';
import { UserModule } from './userManagement/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronjobsModule } from './cronjobs/cronjobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserManagementModule } from './userManagement/user-management.module';
import { LogsModule } from './master-logs/master-logs.module';
import { ConfigModule } from '@nestjs/config';
import { typeAsyncOrmMVPConfig } from './configs/configuration.mvp.config';
import { HomeModule } from './admin-page/home/home.module';
import { AboutModule } from './admin-page/about/about.module';
import { QualityModule } from './admin-page/quality/quality.module';
import { ManufacturingProductModule } from './admin-page/manufacturing-product/manufacturing-product.module';
import { SocialEnvironmentModule } from './admin-page/social-environment/social-environment.module';
import { RecruitmentModule } from './admin-page/recruitment/recruitment.module';
import { ContactModule } from './admin-page/contact/contact.module';
import { MailModule } from './mail/mail.module';
import { VisitModule } from './admin-page/visit/visit.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: process.env.NODE_ENV === 'local' ? '.env.local' : '.env.ifs'
      }
    ),
    TypeOrmModule.forRootAsync(typeAsyncOrmMVPConfig),
    ScheduleModule.forRoot(),
    UserModule,
    UserManagementModule,
    LogsModule,
    HomeModule,
    AboutModule,
    QualityModule,
    ManufacturingProductModule,
    SocialEnvironmentModule,
    RecruitmentModule,
    ContactModule,
    MailModule,
    VisitModule
    // CronjobsModule
  ],
  providers: [],
})
export class AppModule {
}
