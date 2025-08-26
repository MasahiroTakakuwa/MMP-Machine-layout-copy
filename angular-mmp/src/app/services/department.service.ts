import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPermission } from '../interface/permission';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  apiUrl = environment.apiURL;
  constructor(private http: HttpClient) { }
  getDepartments$(): Observable<IPermission[]> {
    return this.http.get<IPermission[]>(this.apiUrl + '/departments');
  }
  getDepartmentById$(id: number): Observable<IPermission> {
    return this.http.get<IPermission>(this.apiUrl + '/departments/' + id);
  }
  addDepartment$(name: string): Observable<IPermission> {
    return this.http.post<IPermission>(this.apiUrl + '/departments', name);
  }
  updateDepartmentById$(info: IPermission): Observable<IPermission> {
    return this.http.put<IPermission>(this.apiUrl + '/departments/' + info.id, { name: info.name });
  }
  deleteDepartmentById$(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/departments/' + id);
  }
}
