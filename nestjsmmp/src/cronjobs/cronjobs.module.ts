import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';

@Module({
  providers: [CronjobsService],
  imports: []
})
export class CronjobsModule {}
