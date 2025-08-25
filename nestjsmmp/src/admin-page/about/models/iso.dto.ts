import { IsNotEmpty} from "class-validator"

export class EnterIso{

    name?: string;

    edit_name ?: string;
    
    @IsNotEmpty()
    action: string;
    
}

