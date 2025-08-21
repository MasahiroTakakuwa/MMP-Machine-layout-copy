// ==============================================================================
// src/app/app.component.ts
// 📄 app.component.ts - 🇻🇳 Component gốc của toàn bộ ứng dụng Angular (standalone)
//                      🇯🇵 Angularアプリ全体のルートコンポーネント（スタンドアロン）
//
// ✅ 🇻🇳 Đây là nơi định nghĩa cấu trúc, logic, và style chung cho toàn ứng dụng.
//         Nó sẽ được gắn vào <app-root> trong index.html.
//
// ✅ 🇯🇵 このファイルは、アプリ全体の構造・ロジック・スタイルを定義する中心コンポーネントです。
//         index.html内の<app-root>にマウントされます。
// ==============================================================================

import { Component } from '@angular/core';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';

// 🇻🇳 Định nghĩa component gốc của toàn bộ ứng dụng Angular.
// 🇯🇵 Angularアプリ全体のルートコンポーネントを定義します。
@Component({
  selector: 'app-root', // 🇻🇳 Thẻ HTML này được dùng trong index.html để gắn ứng dụng vào.
                        // 🇯🇵 このタグはindex.html内で使用され、アプリを差し込む場所になります。
  standalone: true,     // 🇻🇳 Component hoạt động độc lập, không cần module bao quanh.
                        // 🇯🇵 このコンポーネントはモジュールに依存せず単独で動作します。
  imports: [DashboardComponent], // 🇻🇳 Import component dashboard để sử dụng trong template.
                                 // 🇯🇵 テンプレート内でdashboardコンポーネントを使用できるようにします。
  templateUrl: './app.component.html', // 🇻🇳 Đường dẫn đến file HTML template của component này.
                                       // 🇯🇵 このコンポーネントのHTMLテンプレートファイルへのパスです。
  styleUrls: ['./app.component.scss']  // 🇻🇳 Đường dẫn đến file style riêng của component này.
                                       // 🇯🇵 このコンポーネント専用のスタイルファイルへのパスです。
})
export class AppComponent {
  title = 'frontend'; // 🇻🇳 Tiêu đề mặc định của app, có thể dùng làm biến chung.
                      // 🇯🇵 アプリのデフォルトタイトル、共通変数として利用可能です。
}
