import { User } from './../entities/users.entity';

import { UserService } from './../user/user.service';
import { AuthService } from './../auth/auth.service';
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor (
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService
    ){
  }

  async canActivate(
    context: ExecutionContext,
  ){
    const access = this.reflector.get<string>('access', context.getHandler());
    if(!access){
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const id = await this.authService.userId(request);

    const user: User = await this.userService.findOne(id);

     // 🔹 Lấy danh sách permission từ tất cả roles
    const permissionIds = [
        ...new Set(
            user.roles.flatMap(role => role.permissions.map(p => p.id))
        )
    ];

    // const checkPermission = permissionIds.some(p => (p === Number(access) && user.status === 'active'));
    const checkPermission = user.status === 'active' && permissionIds.includes(Number(access));

    if(checkPermission === false){
      throw new ForbiddenException('INSUFFICIENT AUTHORITY', { cause: new Error(), description: 'INSUFFICIENT AUTHORITY' });
    }else{
      return checkPermission;
    }

  }
}
