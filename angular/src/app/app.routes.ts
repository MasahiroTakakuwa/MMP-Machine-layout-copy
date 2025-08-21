// ==============================================================================
// src/app/routes.ts
// 📄 app.routes.ts - 🇻🇳 Cấu hình định tuyến (routing) cho ứng dụng Angular
//                   🇯🇵 Angularアプリのルーティング設定ファイル
//
// ✅ 🇻🇳 File này định nghĩa các đường dẫn URL tương ứng với các trang (component).
//         Khi người dùng truy cập một URL, Angular sẽ hiển thị component tương ứng.
//
// ✅ 🇯🇵 このファイルでは、URLパスに応じて表示されるコンポーネント（ページ）を定義します。
//         ユーザーが特定のURLにアクセスすると、対応するページが表示されます。
// ==============================================================================

import { Routes } from '@angular/router';
import { MercuryComponent } from './mercury/mercury.component';
import { TierraComponent } from './tierra/tierra.component';
import { Tierra2Component } from './tierra2/tierra2.component';
import { JupiterComponent } from './jupiter/jupiter.component';
import { SaturnComponent } from './saturn/saturn.component';

// 🇻🇳 Định nghĩa các tuyến đường (route) cho ứng dụng Angular.
// 🇯🇵 Angularアプリのルーティング（ページ遷移）を定義します。
export const routes: Routes = [
  { path: '', redirectTo: 'mercury', pathMatch: 'full' },
  // 🇻🇳 Khi truy cập đường dẫn gốc (""), tự động chuyển hướng sang trang "mercury".
  // 🇯🇵 空のパス（""）にアクセスすると、自動的に "mercury" ページへリダイレクトします。

  { path: 'mercury', component: MercuryComponent },
  { path: 'tierra', component: TierraComponent },
  { path: 'tierra2', component: Tierra2Component },
  { path: 'jupiter', component: JupiterComponent },
  { path: 'saturn', component: SaturnComponent },
  // 🇻🇳 Các route tương ứng với từng nhà máy (component).
  // 🇯🇵 それぞれの工場ページに対応するルート定義です。
];
