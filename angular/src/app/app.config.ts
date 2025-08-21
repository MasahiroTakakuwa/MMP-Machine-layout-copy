// ==============================================================================
// src/app/config.ts
// 📄 config.ts - 🇻🇳 Cấu hình tổng thể cho ứng dụng Angular (ApplicationConfig)
//               🇯🇵 Angularアプリ全体の設定ファイル（ApplicationConfig）
//
// ✅ 🇻🇳 File này dùng để cấu hình các provider mặc định như router, zone, HTTP…
//         Thường được sử dụng khi bootstrap bằng `bootstrapApplication(...)`.
//
// ✅ 🇯🇵 このファイルでは、ルーターやゾーン検出などのプロバイダーを定義します。
//         `bootstrapApplication(...)` の際に読み込まれます。
// ==============================================================================

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// 🇻🇳 Cấu hình ứng dụng Angular, bao gồm router và zone detection.
// 🇯🇵 Angularアプリの設定（ルーティングやゾーン検出など）を定義します。
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // 🇻🇳 Kích hoạt tối ưu hiệu năng bằng cách gom nhóm sự kiện DOM.
    // 🇯🇵 DOMイベントの処理をグループ化することでパフォーマンスを最適化します。

    provideRouter(routes),
    // 🇻🇳 Cung cấp cấu hình định tuyến từ file app.routes.ts.
    // 🇯🇵 app.routes.ts で定義されたルーティング設定を読み込みます。
  ]
};
