import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsersService } from '../services/users.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountsManagementGuard implements CanActivate {
  constructor(private usersService: UsersService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.usersService.getUsers$().pipe(
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
