import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PermissionService } from '../services/permission.service';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(private permissionService: PermissionService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.permissionService.getPermissions$().pipe(
        map(() => {
          return true;
        }),
        catchError(() => {
          this.router.navigate(['welcome-page']);
          return of(false);
        })
      );
  }
  
}
