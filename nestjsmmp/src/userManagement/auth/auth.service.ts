import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException, NotAcceptableException} from '@nestjs/common';

@Injectable()
export class AuthService {

    constructor(private jwtService : JwtService) {
        
    }

    async userId(request : Request): Promise<number> {
        // console.log('8');
        const cookie = request.cookies['jwtmmpmachinelayout'];
        // console.log(cookie);

        if(!cookie){
            throw new UnauthorizedException('YOU ARE NOT LOGGED IN', { cause: new Error(), description: 'YOU ARE NOT LOGGED IN' });
        }
        try {
            const decoded = await this.jwtService.verifyAsync(cookie);
            return decoded['id'];
        }
        catch(err){
            throw new NotAcceptableException('ACCESS DENIED', { cause: new Error(), description: 'ACCESS DENIED' });
        }
        
    }
}
