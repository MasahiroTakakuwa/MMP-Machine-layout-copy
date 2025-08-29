import { Module } from '@nestjs/common';
import { InputStopMachineController } from './input-stop-machine.controller';
import { InputStopMachineService } from './input-stop-machine.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleStopMachineCurrent } from './models/schedule-stop-machine-current.entity';
import { ScheduleStopMachineHistory } from './models/schedule-stop-machine-history.entity';

@Module({
  controllers: [InputStopMachineController],
  providers: [InputStopMachineService],
  imports: [TypeOrmModule.forFeature([ScheduleStopMachineCurrent, ScheduleStopMachineHistory])]
})
export class InputStopMachineModule {}
