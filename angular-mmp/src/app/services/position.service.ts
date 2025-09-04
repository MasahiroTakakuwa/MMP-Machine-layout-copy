import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IDepartment, IPermission } from '../interface/permission';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  apiUrl = environment.apiURL;
  constructor(private http: HttpClient) { }
  getPosition$(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(this.apiUrl + '/positions');
  }
  getPositionById$(id: number): Observable<IDepartment> {
    return this.http.get<IDepartment>(this.apiUrl + '/positions/' + id);
  }
  addPosition$(info: IDepartment): Observable<IDepartment> {
    return this.http.post<IDepartment>(this.apiUrl + '/positions', info);
  }
  updatePositionById$(info: IDepartment): Observable<IDepartment> {
    return this.http.put<IDepartment>(this.apiUrl + '/positions/' + info.id, { name: info.name });
  }
  deletePositionById$(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/positions/' + id);
  }
}
