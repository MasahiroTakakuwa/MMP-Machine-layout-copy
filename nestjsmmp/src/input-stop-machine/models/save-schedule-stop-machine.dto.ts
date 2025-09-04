import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

//This class is used to validate data
export class SaveScheduleStopMachineDto{
    
    @ApiProperty({example: 1}) //this is example data (can be ignored)
    @IsNotEmpty() //this filed required
    machine_status_history_id: number

    @ApiProperty({example: '2025-08-10'}) //this is example data (can be ignored)
    @IsNotEmpty() //this filed required
    date_start: string

    @ApiProperty({example: '2025-08-20'}) //this is example data (can be ignored)
    date_end?: string

    @ApiProperty({example: 1})
    shift?: number

    @ApiProperty({example: 'No plan producing'}) //this is example data (can be ignored)
    @IsNotEmpty() //this filed required
    content: string

}