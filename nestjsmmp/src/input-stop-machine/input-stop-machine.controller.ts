import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { InputStopMachineService } from './input-stop-machine.service';
import { SaveScheduleStopMachineDto } from './models/save-schedule-stop-machine.dto';

@Controller('input-stop-machine')
export class InputStopMachineController {
    constructor(
        private inputStopMachineService: InputStopMachineService
    ){}

    //api to save schedule stop machine
    @Post('save-status-machine')
    async saveStatusMachine(@Body() body: SaveScheduleStopMachineDto){ //SaveScheduleStopMachineDto is used to validate data come in
        return this.inputStopMachineService.saveScheduleStopMachine(body)
    }

    //api to set Run status of machine
    @Put('run-machine/:id')
    async runMachine(@Param('id') id: number){
        return this.inputStopMachineService.runMachine(id)
    }

    //api to get schedule history
    @Get('history/:id')
    async getHistoryStopMachine(@Param('id') id: number){
        return this.inputStopMachineService.getHistoryStopMachine(id)
    }
}
