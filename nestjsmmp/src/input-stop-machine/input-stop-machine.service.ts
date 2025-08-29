import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { SaveScheduleStopMachineDto } from './models/save-schedule-stop-machine.dto';
import { ScheduleStopMachineCurrent } from './models/schedule-stop-machine-current.entity';
import { ScheduleStopMachineHistory } from './models/schedule-stop-machine-history.entity';

@Injectable()
export class InputStopMachineService {
    constructor(
        private entityManager: EntityManager
    ){}

    async saveScheduleStopMachine(data: SaveScheduleStopMachineDto){
        try{
            return await this.entityManager.transaction(async transactionalEntityManager=>{
                let schedule_stop_current = await this.entityManager.find(ScheduleStopMachineCurrent, {
                    where: {
                        machine_status_history_id: data.machine_status_history_id
                    }
                })
                if(schedule_stop_current.length>0){
                    await transactionalEntityManager.delete(ScheduleStopMachineCurrent, schedule_stop_current)
                }
                let data_insert = await Promise.all([
                    transactionalEntityManager.insert(ScheduleStopMachineCurrent, data),
                    transactionalEntityManager.insert(ScheduleStopMachineHistory, data)
                ])
                return data_insert
            })
        }catch(error){
            throw new InternalServerErrorException(error)
        }
    }


    async runMachine(machine_id: number){
        try{
            return await this.entityManager.transaction(async transactionalEntityManager=>{
                let schedule_stop_current = await this.entityManager.find(ScheduleStopMachineCurrent, {
                    where: {
                        machine_status_history_id: machine_id
                    }
                })
                if(schedule_stop_current.length>0){
                    await transactionalEntityManager.delete(ScheduleStopMachineCurrent, schedule_stop_current)
                }
                return {message: 'Success'}
            })
        }catch(error){
            throw new InternalServerErrorException(error)
        }
    }

    async getHistoryStopMachine(machine_id: number){
        try{
            console.log(machine_id)
            let schedule_stop_history = await this.entityManager.find(ScheduleStopMachineHistory, {
                where: {
                    machine_status_history_id: machine_id
                }
            })
            console.log(schedule_stop_history)
            return schedule_stop_history
        }catch(error){
            throw new InternalServerErrorException(error)
        }
    }

}
