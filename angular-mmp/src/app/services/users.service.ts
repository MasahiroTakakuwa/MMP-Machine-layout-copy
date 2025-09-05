import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStaff, IUser } from '../interface/user';
import { Validators } from '@angular/forms';
import { IPermission } from '../interface/permission';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl = environment.apiURL;
  constructor(private http: HttpClient) { }
  getUsers$(): any {
    return this.http.get(this.apiUrl + '/users');
  }
  getUserById$(id: number): Observable<any> {
    return this.http.get(this.apiUrl + '/users/' + id);
  }
  getStaffsOfDepartment$(): Observable<IStaff[]> {
    return this.http.get<IStaff[]>(this.apiUrl + '/boss');
  }
  addUser$(info: any): Observable<any> {
    return this.http.post(this.apiUrl + '/register', info);
  }
  updatePassword$(password: { password: string, password_confirm: string }): Observable<IUser> {
    return this.http.put<IUser>(this.apiUrl + '/users/password', password);
  }
  updatePersonalInfo$(info: any): Observable<IUser> {
    return this.http.put<IUser>(this.apiUrl + '/users/info', info);
  }
  updateDepartment$(info: any): Observable<IUser> {
    return this.http.put<IUser>(this.apiUrl + '/users/edit/role-department', info);
  }
  updateUserById$(info: any): Observable<IUser> {
    return this.http.put<IUser>(this.apiUrl + '/users/change-info/' + info.id, info);
  }
  deleteUserById$(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/users/' + id);
  }
  resetPassword$(id: number): Observable<IUser> {
    return this.http.put<IUser>(this.apiUrl + '/users/reset/' + id, {});
  }
  // Tìm tên người dùng bằng api của mvp
  searchUserInfo$(id: number) {
    return this.http.get('https://id.mvpapp.vn/api/v1/getUserInfo_R9ia37vV0HgUod0z?id=' + id, { headers: { skip: "true" } });
  }

  // Share thông tin user
  private user$ = new BehaviorSubject<any>({ permission: [] });
  selectedUser = this.user$.asObservable();
  setUser(user: IUser) {
    this.user$.next(user);
  }

  // update validator chuyền, nếu bộ phận sx thì bắt buộc chọn chuyền
  updateDepValidator(isValid: Boolean, form: any) {
    if (isValid) {
      form.get('lib_line').addValidators(Validators.required);
    } else {
      form.get('lib_line').clearValidators();
    }
    form.get('lib_line').updateValueAndValidity();
  }

  // các key có giá trị false thì gán = null
  removeFalseKey(form: any) {
    for (let key in form.value) {
      if (!form.value[key]) {
        form.value[key] = null;
      }
    }
  }

  // cắt họ và tên 
  generateName(fullname: string) {
    const array = fullname.split(' ');
    const first_name = array.slice(-1).join('');
    const last_name = array.slice(0, array.length - 1).join(' ');
    return [first_name, last_name];
  }

  // tìm bộ phận
  // nếu bộ phận không có trên csdl thì mặc định chọn khác
  findDepartmentId(list: IPermission[], departmentName: string) {
    let department: number | string | null;
    if (list.some(item => item.name.trim() == departmentName.trim())) {
      department = list.find(item => item.name.trim() == departmentName.trim())?.id || null;
    } else {
      department = null;
    }
    return department;
  }

  // danh sách nhân viên phòng bảo trì
  getFeUsers() {
    return this.http.get(this.apiUrl + '/users/users-list/fe');
  }

  // danh sách công nhân sản xuất
  getProUsers() {
    return this.http.get(this.apiUrl + '/users/users-list/pro');
  }
}
