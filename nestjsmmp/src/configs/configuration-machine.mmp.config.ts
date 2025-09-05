import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MachineStatusHistory } from 'src/machine/models/machine-status-history.entity';

export const typeAsyncOrmMMPMachineConfig: TypeOrmModuleAsyncOptions  = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    // change information port, host, username, password, database suit for your system
    return {
      name: 'machine_mmp',
      type: 'mssql',
      port: 3306,
      host: '',
      username: '',
      password: '',
      database: '',
      entities: [MachineStatusHistory],
      synchronize: false, //set true if need to sync database
       options: {
        encrypt: false,
        enableArithAbort: true,
        instanceName: 'SQLEXPRESS', // ✅ Nếu dùng SQL Server Express
                                    // ✅ SQL Server Express を使用する場合
        trustServerCertificate: true // ✅ Cho phép nếu không dùng SSL chính thống
                                     // ✅ 正式なSSL証明書を使っていない場合に必要
      }
    };
  },
};

