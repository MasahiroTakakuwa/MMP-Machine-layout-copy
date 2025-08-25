import { Request } from 'express';
import { Controller, Post, Req } from '@nestjs/common';
import { VisitService } from './visit.service';

@Controller('visit')
export class VisitController {
    constructor( 
        private visitService: VisitService
        ){
    }

    @Post()
    async addVisit(
        @Req() request: Request
    ) {
        return this.visitService.addVisit(request);
    }
}
