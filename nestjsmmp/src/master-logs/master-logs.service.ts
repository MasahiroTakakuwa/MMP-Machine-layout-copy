import { Logs } from './models/master-logs.entity';
import { Injectable } from '@nestjs/common';
import { AbstractService } from '../userManagement/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';

import { Like, Repository } from 'typeorm';

@Injectable()
export class LogsService extends AbstractService {
    constructor(
        @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>
    ){
        super(logsRepository);
    }

    async find_all_logs(): Promise<Logs[]> {
        const logs = await this.repository.find({take: 1000, order: { created_at : 'DESC'}, relations: ['users']});
        logs.forEach(log =>{
            log.action = log.action.replace("incident_id", "Mã sự cố")
        })
        return logs;
    }

    async find_user_logs(user_name: string): Promise<Logs[]> {
        const logs = await this.repository.find({where: {users : {user_name: user_name}},take: 1000, order: { created_at : 'DESC'}, relations: ['users']});
        logs.forEach(log =>{
            log.action = log.action.replace("incident_id", "Mã sự cố")
        })
        return logs;
    }

    async find_incident_logs(incidentId: number): Promise<Logs[]> {
        const logs = await this.repository.find({where: {action: Like(`incident_id: ${incidentId}.%`)}, order: { created_at : 'ASC'}, relations: ['users']});
        logs.forEach(log =>{
            log.action = log.action.replace("incident_id", "Mã sự cố")
        })
        return logs;
    }

}
