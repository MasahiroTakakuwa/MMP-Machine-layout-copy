import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { IUser, IUserSignin, IUserSignup } from '../interface/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiURL;
  constructor(private http: HttpClient, private router: Router) { }
  authenticate$(): any {
    return this.http.get<IUser>(this.apiUrl + '/user');
  }
  signin$(user: IUserSignin): Observable<any> {
    return of(true);
    return this.http.post<IUser>(this.apiUrl + '/login', user);
  }
  signup$(user: IUserSignup): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl + '/register', user);
  }
  signout$() {
    this.http.post(this.apiUrl + '/logout', {}).subscribe(
      () => this.router.navigate(['/authentication/signin']),
      () => alert('Đã có lỗi xảy ra, xin thử lại')
    )
  }
}
