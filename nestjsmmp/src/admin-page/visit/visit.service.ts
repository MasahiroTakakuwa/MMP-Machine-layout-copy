import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from './models/visit.entity';
import { AbstractService } from 'src/userManagement/common/abstract.service';
import { Request } from 'express';

@Injectable()
export class VisitService extends AbstractService{

    constructor(
        @InjectRepository(Visit) private readonly visitRepository: Repository<Visit>
    ){
        super(visitRepository);
    }

    async createVisit(request: Request) {

        const visit = new Visit();
        visit.ip_address = request.ip;

        return await this.visitRepository.save(visit);
    }
    
    async getVisitCount(): Promise<number> {
        return await this.visitRepository.count();
    }

    async addVisit(request: Request): Promise<number> {

        await this.createVisit(request);

        return await this.getVisitCount();
    }
}
