// ==============================================================================
// src/app.module.ts
// 📄 app.module.ts - 🇻🇳 Cấu hình chính của ứng dụng NestJS (Root module)
//                   🇯🇵 NestJSアプリケーションのルートモジュール設定
//
// ✅ 🇻🇳 File này dùng để:
//       • Import các module cần thiết (Config, TypeORM, Feature Modules)
//       • Thiết lập kết nối cơ sở dữ liệu SQL Server
//       • Khai báo controller và service chính của ứng dụng
//
// ✅ 🇯🇵 このファイルでは：
//       • 必要なモジュール（Config、TypeORM、機能モジュール）をインポート
//       • SQL Serverへのデータベース接続を設定
//       • アプリケーションのメインコントローラーとサービスを宣言
// ==============================================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { MachineStatusHistory } from './entities/machine-status-history.entity';
import { MachineService } from './machine/machine.service';
import { MachineController } from './machine/machine.controller';

@Module({
  imports: [
    // ==========================================================================
    // 🌐 ConfigModule - 🇻🇳 Cho phép dùng biến môi trường toàn cục
    //                  🇯🇵 環境変数をグローバルに使用可能にする設定
    // ==========================================================================
    ConfigModule.forRoot({ isGlobal: true }),

    // ==========================================================================
    // 🗄️ TypeORM - 🇻🇳 Thiết lập kết nối SQL Server từ .env
    //              🇯🇵 .envファイルからSQL Serverへの接続情報を取得
    // ==========================================================================
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [MachineStatusHistory],
      synchronize: false, // ❌ Không tự động sync schema (an toàn cho DB thật)
                          // ❌ 本番DBに対してスキーマ自動同期しない（安全）

      options: {
        encrypt: false,
        enableArithAbort: true,
        instanceName: 'SQLEXPRESS', // ✅ Nếu dùng SQL Server Express
                                    // ✅ SQL Server Express を使用する場合
        trustServerCertificate: true // ✅ Cho phép nếu không dùng SSL chính thống
                                     // ✅ 正式なSSL証明書を使っていない場合に必要
      }
    }),

    // ==========================================================================
    // 📦 Đăng ký entity cho các repository sử dụng @InjectRepository()
    //    @InjectRepository() で使用するエンティティを登録
    // ==========================================================================
    TypeOrmModule.forFeature([MachineStatusHistory])
  ],

  // ============================================================================
  // 🎮 Controller điều khiển API
  //    APIルーティングを制御するコントローラー
  // ============================================================================
  controllers: [MachineController],

  // ============================================================================
  // ⚙️ Service chứa logic xử lý nghiệp vụ
  //    業務ロジックを含むサービス
  // ============================================================================
  providers: [MachineService],
})
export class AppModule {}
