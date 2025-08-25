import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
 
  async send_mail_to(mails: string[], subject) {
    await this.mailerService.sendMail({
        to: mails,
    //   to: ["luan@marueivn.com", "tamvan5996@marueivn.com", "thanhtran6054@marueivn.com", "thanhthuan@marueivn.com", "cuongnguyen6157@marueivn.com", "thinguyen6424@marueivn.com", "xuannam@marueivn.com", "sondao6430@marueivn.com", "khanhdao6372@marueivn.com", "khangvo6082@marueivn.com"],
      // from: '"Support Team" <support@example.com>', // override default from
        subject,
        template: './templates', // `.hbs` extension is appended automatically
        context: { 
        // ở đây để biến truyền qua file templates
      },
    });
  }
}
