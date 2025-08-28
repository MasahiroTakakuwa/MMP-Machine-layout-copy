import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IDepartment, IPermission } from '../interface/permission';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  apiUrl = environment.apiURL;
  constructor(private http: HttpClient) { }
  getDepartments$(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(this.apiUrl + '/departments');
  }
  getDepartmentById$(id: number): Observable<IDepartment> {
    return this.http.get<IDepartment>(this.apiUrl + '/departments/' + id);
  }
  addDepartment$(info: IDepartment): Observable<IDepartment> {
    return this.http.post<IDepartment>(this.apiUrl + '/departments', info);
  }
  updateDepartmentById$(info: IDepartment): Observable<IDepartment> {
    return this.http.put<IDepartment>(this.apiUrl + '/departments/' + info.id,  info);
  }
  deleteDepartmentById$(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/departments/' + id);
  }
}
