import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { Visit } from './models/visit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visit]),
  ],
  providers: [VisitService],
  controllers: [VisitController],
  exports: [VisitService]
})
export class VisitModule {}
