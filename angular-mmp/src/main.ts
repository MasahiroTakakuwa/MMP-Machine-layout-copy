import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { ConfirmationService, MessageService } from 'primeng/api';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // giữ nguyên providers cũ
    ConfirmationService,
    MessageService
  ]
}).catch((err) => console.error(err));
