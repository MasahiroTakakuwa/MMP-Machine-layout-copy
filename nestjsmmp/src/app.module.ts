import { Module } from '@nestjs/common';
import { UserModule } from './userManagement/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserManagementModule } from './userManagement/user-management.module';
import { LogsModule } from './master-logs/master-logs.module';
import { ConfigModule } from '@nestjs/config';
import { typeAsyncOrmMVPConfig } from './configs/configuration.mvp.config';
import { InputStopMachineModule } from './input-stop-machine/input-stop-machine.module';
import { MachineModule } from './machine/machine.module';
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
    InputStopMachineModule,
    MachineModule
  ],
  providers: [],
})
export class AppModule {
}
