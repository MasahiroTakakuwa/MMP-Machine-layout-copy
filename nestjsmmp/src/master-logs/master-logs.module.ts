import { Logs } from './models/master-logs.entity';
import { UserModule } from '../userManagement/user/user.module';
import { AuthModule } from '../userManagement/auth/auth.module';
import { CommonModule } from '../userManagement/common/common.module';
import { Module, forwardRef } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsService } from './master-logs.service';
import { LogsController } from './master-logs.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Logs]),
        CommonModule,
        AuthModule,
        forwardRef(() => UserModule),
    ],
    providers: [LogsService],
    exports: [LogsService],
    controllers: [LogsController]
})
export class LogsModule {}
