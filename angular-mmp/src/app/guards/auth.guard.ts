import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private usersService: UsersService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.authenticate$().pipe(
      map((res: any) => {
        this.usersService.setUser(res);
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }
}
