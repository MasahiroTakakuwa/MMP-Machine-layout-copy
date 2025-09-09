import { Module } from '@nestjs/common';
import { InputStopMachineController } from './input-stop-machine.controller';
import { InputStopMachineService } from './input-stop-machine.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleStopMachineCurrent } from './models/schedule-stop-machine-current.entity';
import { ScheduleStopMachineHistory } from './models/schedule-stop-machine-history.entity';
import { AuthModule } from 'src/userManagement/auth/auth.module';
import { CommonModule } from 'src/userManagement/common/common.module';

@Module({
  controllers: [InputStopMachineController],
  providers: [InputStopMachineService],
  imports: [
    TypeOrmModule.forFeature([ScheduleStopMachineCurrent, ScheduleStopMachineHistory]), //import entities (table) to use in module
    AuthModule, //phân quyền phải thêm module này,
    CommonModule //phân quyền phải thêm module này,
  ]  
})
export class InputStopMachineModule {}
