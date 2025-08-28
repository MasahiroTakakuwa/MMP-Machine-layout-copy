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
    return this.http.get<IUser>(this.apiUrl + '/user', {headers: {
        // noRefresh: 'true'
      }});
  }
  signin$(user: IUserSignin): Observable<IUser> {
    // return of(true);
    return this.http.post<IUser>(this.apiUrl + '/login', user, {
      withCredentials: true,
      headers: {
        noRefresh: 'true'
      }});
  }
  signup$(user: IUserSignup): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl + '/register', user);
  }
  signout$() { 
    this.http.post(this.apiUrl + '/logout', {}, {
      withCredentials: true,
      headers: {
        noRefresh: 'true'
      }}).subscribe( () => 
      this.router.navigate(['/auth/login']), 
      // () => alert('Đã có lỗi xảy ra, xin thử lại') 
    ) 
  }
  refreshToken$(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      this.apiUrl + '/refresh',
      {},
      { withCredentials: true,
        headers: {
          noRefresh: 'true'
        }
      }, // cần gửi cookie refresh token
      
    );
  }

}
