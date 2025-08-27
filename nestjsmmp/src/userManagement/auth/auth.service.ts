import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException, NotAcceptableException} from '@nestjs/common';

@Injectable()
export class AuthService {

    constructor(
        private jwtService : JwtService,
        private configService : ConfigService
    ) {
        
    }

    async userId(request: Request): Promise<number> {
        const token = request.cookies['jwtmmpmachinelayout'];
        if (!token) {
            throw new UnauthorizedException('YOU ARE NOT LOGGED IN');
        }
        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('SECRETSJWT'),
            });
            if (!decoded || !decoded['sub']) {
                throw new UnauthorizedException('INVALID TOKEN PAYLOAD');
            }
            return decoded['sub'];
        } catch (err) {
            throw new UnauthorizedException('ACCESS DENIED');
        }
    }
}
