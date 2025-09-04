import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment, IPermission, IRolePermission } from '../interface/permission';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  apiUrl = environment.apiURL;
  constructor(private http: HttpClient) { }
  getRoles$(): Observable<IRolePermission[]> {
    return this.http.get<IRolePermission[]>(this.apiUrl + '/roles');
  }
  getRoleById$(id: number): Observable<IRolePermission> {
    return this.http.get<IRolePermission>(this.apiUrl + '/roles/' + id);
  }
  addRole$(info: IRolePermission): Observable<IRolePermission> {
    return this.http.post<IRolePermission>(this.apiUrl + '/roles', {
      name: info.name,
      description: info.description,
      permissionIds: info.permissions.map(per => per.id)
    });
  }
  updateRoleById$(info: IRolePermission): Observable<IRolePermission> {
    return this.http.put<IRolePermission>(this.apiUrl + '/roles/' + info.id, {
      name: info.name,
      description: info.description,
      permissionIds: info.permissions.map(per => per.id)
    });
  }
  deleteRoleById$(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/roles/' + id);
  }
}
