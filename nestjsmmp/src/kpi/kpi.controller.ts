import { Controller, Get, Query } from "@nestjs/common";
import { KpiService } from "./kpi.service";

@Controller('kpi')
export class KpiController {
    constructor(private readonly KpiService: KpiService) {}

    @Get()
    getSummary(@Query('factory') factory: number) {
      return this.KpiService.getPartsNoSummary(factory);

    }

    @Get('lineno')
    getLineNo(@Query('factory') factory: number,
              @Query('parts_no') parts_no: string
    ){
      return this.KpiService.getLineNoSummary(factory,parts_no)
    }

}