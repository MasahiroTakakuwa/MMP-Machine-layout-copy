//==========================================================================
// This file is used to change schedule stop machine in schedule_stop_machine_current table and schedule_stop_machine_history table
//==========================================================================

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { SaveScheduleStopMachineDto } from './models/save-schedule-stop-machine.dto';
import { ScheduleStopMachineCurrent } from './models/schedule-stop-machine-current.entity';
import { ScheduleStopMachineHistory } from './models/schedule-stop-machine-history.entity';

@Injectable()
export class InputStopMachineService {
    constructor(
        private entityManager: EntityManager //declared variable EntityManager
    ){}

    //this function is used to save schedule stop machine
    async saveScheduleStopMachine(data: SaveScheduleStopMachineDto){
        try{ //user try-catch to catch an error if error occur
            return await this.entityManager.transaction(async transactionalEntityManager=>{ //use transaction to roll back if error occur
                //find shedule stop of machine
                let schedule_stop_current = await this.entityManager.find(ScheduleStopMachineCurrent, {
                    where: {
                        machine_status_history_id: data.machine_status_history_id
                    }
                })
                //if exist, delete schedule
                if(schedule_stop_current.length>0){
                    await transactionalEntityManager.delete(ScheduleStopMachineCurrent, schedule_stop_current)
                }
                //Then, insert to schedule_stop_machine_current and schedule_stop_machine_history
                let data_insert = await Promise.all([
                    transactionalEntityManager.insert(ScheduleStopMachineCurrent, data),
                    transactionalEntityManager.insert(ScheduleStopMachineHistory, data)
                ])
                return data_insert
            })
        }catch(error){
            //return error 500 if error occur
            throw new InternalServerErrorException(error)
        }
    }

    //this function is used to set machine to Run status
    async runMachine(machine_id: number){
        try{ //user try-catch to catch an error if error occur
            return await this.entityManager.transaction(async transactionalEntityManager=>{ //use transaction to roll back if error occur
                //find shedule stop of machine
                let schedule_stop_current = await this.entityManager.find(ScheduleStopMachineCurrent, {
                    where: {
                        machine_status_history_id: machine_id
                    }
                })
                //if exist, delete schedule
                if(schedule_stop_current.length>0){
                    await transactionalEntityManager.delete(ScheduleStopMachineCurrent, schedule_stop_current)
                }
                return {message: 'Success'}
            })
        }catch(error){
            //return error 500 if error occur
            throw new InternalServerErrorException(error)
        }
    }

    //This function is used to get history schedule stop machine
    async getHistoryStopMachine(machine_id: number){
        try{ //user try-catch to catch an error if error occur
            //find all schedule of a machine
            let schedule_stop_history = await this.entityManager.find(ScheduleStopMachineHistory, {
                where: {
                    machine_status_history_id: machine_id
                }
            })
            return schedule_stop_history
        }catch(error){
            //return error 500 if error occur
            throw new InternalServerErrorException(error)
        }
    }

}
