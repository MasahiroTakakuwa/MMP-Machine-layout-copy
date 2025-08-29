import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SaveScheduleStopMachineDto{
    
    @ApiProperty({example: 1})
    @IsNotEmpty()
    machine_status_history_id: number

    @ApiProperty({example: '2025-08-10'})
    @IsNotEmpty()
    date_start: string

    @ApiProperty({example: '2025-08-20'})
    date_end?: string

    @ApiProperty({example: 1})
    shift?: number

    @ApiProperty({example: 'No plan producing'})
    @IsNotEmpty()
    content: string

}