import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  apiUrl = environment.apiURL;
  constructor(private http: HttpClient) { }
  getPermissions$(): any {
    return this.http.get(this.apiUrl + '/permissions');
  }
}
