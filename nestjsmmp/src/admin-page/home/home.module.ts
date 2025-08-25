import { LogsModule } from './../../master-logs/master-logs.module';
import { UserModule } from './../../userManagement/user/user.module';
import { AuthModule } from './../../userManagement/auth/auth.module';
import { CommonModule } from './../../userManagement/common/common.module';
import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomePage } from './models/homepage.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([HomePage]),
    CommonModule,
    AuthModule,
    UserModule,
    LogsModule,
  ],
  providers: [HomeService],
  controllers: [HomeController]
})
export class HomeModule {}
