import { User } from './../user/models/users.entity';
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

    const user: User = await this.userService.findOne({id}, ['role', 'department']);

    let permissions = [];
    if(user.role?.id === null || user.role?.id === undefined || user.department?.id === undefined || user.department?.id === null){
      permissions = [];
    }else{
      permissions = await this.userService.queryPermission({roleId: user.role.id}, {departmentId: user.department.id});
    }

     
    const checkPermission = permissions.some(p => (p.permissionId === access && user.status === 'active'));

    if(checkPermission === false){
      throw new ForbiddenException('INSUFFICIENT AUTHORITY', { cause: new Error(), description: 'INSUFFICIENT AUTHORITY' });
    }else{
      return checkPermission;
    }

  }
}
