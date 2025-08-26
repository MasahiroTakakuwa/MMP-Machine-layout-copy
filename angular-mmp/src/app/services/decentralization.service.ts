import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPermissionById } from '../interface/permission';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DecentralizationService {
  apiUrl = environment.apiURL;
  constructor(private http: HttpClient) { }
  getDecentralizationId$({ departmentId, roleId }: {departmentId: number, roleId: number}): Observable<IPermissionById[]> {
    return this.http.get<IPermissionById[]>(this.apiUrl + '/decentralizations/' + roleId + '/' + departmentId);
  }
  addDecentralization$({ departmentId, roleId, permissionsId } : { departmentId : number, roleId: number, permissionsId: number }): Observable<any> {
    return this.http.post(this.apiUrl + '/decentralizations', { departmentId, roleId, permissionsId });
  }
  deleteDecentralizationById$(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/decentralizations/' + id);
  }
}
