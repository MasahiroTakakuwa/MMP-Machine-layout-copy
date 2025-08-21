// ==============================================================================
// src/app/layouts/dashboard/dashboard.component.ts
// 📄 dashboard.component.ts - 🇻🇳 Component bố cục chính của ứng dụng (Dashboard Layout)
//                            🇯🇵 アプリのメインレイアウトを担当するコンポーネント
//
// ✅ 🇻🇳 File này định nghĩa component dashboard, hiển thị sidebar điều hướng nhà máy
//         và xử lý logic chuyển đổi giữa các nhà máy thủ công và tự động.
//
// ✅ 🇯🇵 このファイルでは、サイドバー付きダッシュボードを定義し、
//         工場画面の手動および自動切替ロジックを実装します。
// ==============================================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Bắt buộc để dùng [(ngModel)]
// ✅ 🇻🇳 Cần thiết để dùng two-way binding [(ngModel)] trong HTML
//    🇯🇵 テンプレート内で[(ngModel)]を使うために必要

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  isSidebarOpen: boolean = true;           // Thêm biến quản lý đóng mở Sidebar

  currentFactory: string = '';             // 🇻🇳 Nhà máy hiện tại đang chọn
                                           // 🇯🇵 現在選択中の工場
  autoSwitchEnabled: boolean = false;      // 🇻🇳 Trạng thái công tắc tự động chuyển nhà máy
                                           // 🇯🇵 自動切替機能のオン/オフ状態
  private autoSwitchInterval: any;         // 🇻🇳 Biến lưu ID của interval
                                           // 🇯🇵 setIntervalのIDを格納する変数
  private factoryList: string[] = ['mercury', 'tierra', 'tierra2', 'jupiter', 'saturn'];
  // 🇻🇳 Danh sách các nhà máy có thể luân chuyển
  // 🇯🇵 自動切替で巡回する工場のリスト

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Mặc định thu gọn sidebar nếu là màn hình nhỏ
    this.isSidebarOpen = window.innerWidth >= 768; // md breakpoint của Tailwind = 768px

    // 🇻🇳 Gán route hiện tại để highlight menu
    // 🇯🇵 現在のルートを取得してメニューにハイライトを設定
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const segments = event.urlAfterRedirects.split('/');
        this.currentFactory = segments[1];
      }
    });

    // 🇻🇳 Đọc trạng thái công tắc từ localStorage
    // 🇯🇵 localStorageから自動切替の状態を読み込む
    const savedState = localStorage.getItem('autoSwitchEnabled');
    if (savedState === 'true') {
      this.autoSwitchEnabled = true;
      this.startAutoSwitch();
    }
  }

  // Hành động đóng mở Sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // 🇻🇳 Chuyển trang khi click menu
  // 🇯🇵 メニュークリック時に画面遷移
  navigateTo(factory: string): void {
    this.router.navigate([`/${factory}`]);
  }

  // 🇻🇳 Bật/tắt công tắc tự động
  // 🇯🇵 自動切替のオン/オフ操作
  onToggleAutoSwitch(): void {
    localStorage.setItem('autoSwitchEnabled', String(this.autoSwitchEnabled));
    if (this.autoSwitchEnabled) {
      this.startAutoSwitch();
    } else {
      this.stopAutoSwitch();
    }
  }

  // 🇻🇳 Bắt đầu luân chuyển giữa các nhà máy
  // 🇯🇵 工場の自動巡回を開始
  startAutoSwitch(): void {
    let currentIndex = this.factoryList.indexOf(this.currentFactory);
    this.autoSwitchInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % this.factoryList.length;
      this.router.navigate([this.factoryList[currentIndex]]);
    }, 30000); // 🇻🇳 Mỗi 30 giây | 🇯🇵 30秒ごと
  }

  // 🇻🇳 Dừng tự động luân chuyển
  // 🇯🇵 自動切替を停止する
  stopAutoSwitch(): void {
    if (this.autoSwitchInterval) {
      clearInterval(this.autoSwitchInterval);
    }
  }
}
