// ==============================================================================
// src/main.ts
// 📄 main.ts - 🇻🇳 Điểm khởi động (entry point) của ứng dụng NestJS
//             🇯🇵 NestJSアプリケーションのエントリーポイント（起動ファイル）
//
// ✅ 🇻🇳 File này dùng để:
//       • Tạo ứng dụng NestJS từ AppModule
//       • Bật CORS để cho phép frontend truy cập API
//       • Mở cổng lắng nghe để nhận request (port lấy từ biến môi trường hoặc mặc định 3000)
//
// ✅ 🇯🇵 このファイルでは：
//       • AppModule から NestJS アプリを生成
//       • フロントエンドとの通信を許可するために CORS を有効化
//       • 指定されたポート（環境変数）または 3000 番でアプリを起動
// ==============================================================================

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // ✅ Tạo ứng dụng NestJS với CORS được bật
  // ✅ CORSを有効にしたNestJSアプリケーションを作成する

  // CORS (Cross-Origin Resource Sharing) cho phép ứng dụng frontend (Angular)
  // gọi API từ backend (NestJS) mà không bị chặn bởi trình duyệt.
  // Việc bật CORS ở đây sẽ cho phép frontend và backend giao tiếp với nhau
  // ✅ CORS（オリジン間リソース共有）を有効にすることで、
  // ✅ フロントエンド（Angular）からバックエンド（NestJS）へのAPI呼び出しが可能になります。
  // ✅ これにより、ブラウザによる制限を回避し、両者の通信が可能になります。
  const app = await NestFactory.create(AppModule, { cors: true }); // ✅ bật CORS ở đây
  await app.listen(process.env.PORT ?? 3000); // ✅ Lắng nghe cổng từ biến môi trường hoặc mặc định là 3000
  // ✅ 環境変数で指定されたポート、またはデフォルトの3000番ポートで待機します
}
bootstrap();
