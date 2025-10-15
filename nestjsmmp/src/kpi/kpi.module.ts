import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Devices } from "./models/devices.entity";
import { KpiController } from "./kpi.controller";
import { KpiService } from "./kpi.service";

@Module({
    imports: [TypeOrmModule.forFeature([Devices])],
    controllers: [KpiController],
    providers: [KpiService],
})
export class KpiModule {
    
}