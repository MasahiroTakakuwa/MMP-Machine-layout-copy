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
  getPositionById$(id: number): Observable<IPermission> {
    return this.http.get<IPermission>(this.apiUrl + '/positions/' + id);
  }
  addPosition$(name: string): Observable<IPermission> {
    return this.http.post<IPermission>(this.apiUrl + '/positions', name);
  }
  updatePositionById$(info: IPermission): Observable<IPermission> {
    return this.http.put<IPermission>(this.apiUrl + '/positions/' + info.id, { name: info.name });
  }
  deletePositionById$(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/positions/' + id);
  }
}
