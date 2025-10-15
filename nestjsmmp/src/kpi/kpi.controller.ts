import { Controller, Get, Query } from "@nestjs/common";
import { KpiService } from "./kpi.service";

@Controller('kpi')
export class KpiController {
    constructor(private readonly KpiService: KpiService) {}

    @Get()
    getSummary(@Query('factory') factory: number) {
      return this.KpiService.getPartsNoSummary(factory);

    }
}