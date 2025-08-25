import { LogsModule } from './../../master-logs/master-logs.module';
import { UserModule } from './../../userManagement/user/user.module';
import { AuthModule } from './../../userManagement/auth/auth.module';
import { CommonModule } from './../../userManagement/common/common.module';
import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactInformation } from './models/contact-information.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUs } from './models/contact-us.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactInformation, ContactUs]),
    CommonModule,
    AuthModule,
    UserModule,
    LogsModule,
  ],
  controllers: [ContactController],
  providers: [ContactService]
})
export class ContactModule {}
