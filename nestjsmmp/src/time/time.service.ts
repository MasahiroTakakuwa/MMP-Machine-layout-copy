// time.service.ts
import { Injectable } from '@nestjs/common';
import * as momentTimezone from 'moment-timezone';

@Injectable()
export class TimeService {
  private timeZone: string;

  constructor() {
    this.timeZone = 'Asia/Ho_Chi_Minh'; // Đặt múi giờ mặc định
    momentTimezone.tz.setDefault(this.timeZone);
  }

  setTimezone(timeZone: string) {
    this.timeZone = timeZone;
    momentTimezone.tz.setDefault(this.timeZone);
  }

  getCurrentTime(): string {
    return momentTimezone().format('YYYY-MM-DD HH:mm:ss');
  }
  getDayCurrentTime(): string {
    return momentTimezone().format('YYYY-MM-DD');
  }
}