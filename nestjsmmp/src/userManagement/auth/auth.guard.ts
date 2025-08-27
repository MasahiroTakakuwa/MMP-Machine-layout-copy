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
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['jwtmmpmachinelayout'];

    if (!token) {
      throw new UnauthorizedException('YOU ARE NOT LOGGED IN');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRETSJWT'),
      });

      // lưu payload vào request để dùng ở controller/service nếu cần
      request.user = decoded;

      return true;
    } catch (err) {
      throw new UnauthorizedException('INVALID OR EXPIRED TOKEN');
    }
  }
}
