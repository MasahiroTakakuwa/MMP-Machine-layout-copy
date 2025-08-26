import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPermission } from '../interface/permission';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  apiUrl = environment.apiURL;
  constructor(private http: HttpClient) { }
  getRoles$(): Observable<IPermission[]> {
    return this.http.get<IPermission[]>(this.apiUrl + '/roles');
  }
  getRoleById$(id: number): Observable<IPermission> {
    return this.http.get<IPermission>(this.apiUrl + '/roles/' + id);
  }
  addRole$(name: string): Observable<IPermission> {
    return this.http.post<IPermission>(this.apiUrl + '/roles', name);
  }
  updateRoleById$(info: IPermission): Observable<IPermission> {
    return this.http.put<IPermission>(this.apiUrl + '/roles/' + info.id, { name: info.name });
  }
  deleteRoleById$(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/roles/' + id);
  }
}
