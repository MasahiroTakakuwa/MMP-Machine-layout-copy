import { LogsModule } from './../../master-logs/master-logs.module';
import { UserModule } from './../../userManagement/user/user.module';
import { AuthModule } from './../../userManagement/auth/auth.module';
import { CommonModule } from './../../userManagement/common/common.module';
import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { About } from './models/about.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([About]),
    CommonModule,
    AuthModule,
    UserModule,
    LogsModule,
  ],
  providers: [AboutService],
  controllers: [AboutController]
})
export class AboutModule {}
