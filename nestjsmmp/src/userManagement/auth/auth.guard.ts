import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
      private jwtService: JwtService,
      private configService : ConfigService
    ){
  }
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies['jwtmmpmachinelayout'];
    if(!jwt){
      throw new UnauthorizedException('YOU ARE NOT LOGGED IN', { cause: new Error(), description: 'YOU ARE NOT LOGGED IN' });
    }
    try{
      return this.jwtService.verifyAsync(jwt, {secret: this.configService.get<string>('SECRETSJWT')});
    }catch(e){
      // return false;
      throw new UnauthorizedException('INSUFFICIENT AUTHORITY', { cause: new Error(), description: 'INSUFFICIENT AUTHORITY' });
    }

  }
}
