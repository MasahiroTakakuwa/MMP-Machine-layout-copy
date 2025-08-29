import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { InputStopMachineService } from './input-stop-machine.service';
import { SaveScheduleStopMachineDto } from './models/save-schedule-stop-machine.dto';

@Controller('input-stop-machine')
export class InputStopMachineController {
    constructor(
        private inputStopMachineService: InputStopMachineService
    ){}

    @Post('save-status-machine')
    async saveStatusMachine(@Body() body: SaveScheduleStopMachineDto){
        return this.inputStopMachineService.saveScheduleStopMachine(body)
    }

    @Put('run-machine/:id')
    async runMachine(@Param('id') id: number){
        return this.inputStopMachineService.runMachine(id)
    }

    @Get('history/:id')
    async getHistoryStopMachine(@Param('id') id: number){
        return this.inputStopMachineService.getHistoryStopMachine(id)
    }
}
