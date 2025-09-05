import { IDepartment, IPermission, IRolePermission } from "./permission"

export interface IUser {
  id: number | null,
  user_name: string,
  first_name: string,
  last_name: string,
  email: string,
  status: string,
  created_at: string,
  role?: IPermission | number,
  department?: IPermission | number, 
  permission?: Array<Array<any>>,
  password?: string,
  password_confirm?: string,
  phone_number?: string
  telegram?: string,
  avatar: string
  online?: null | string
}

export interface IUserSignin {
  user_name: string,
  password: string
}

export interface IUserSignup extends IUserSignin {
  avatar: string,
  department: number,
  email: string,
  first_name: string,
  last_name: string,
  lib_line?: number,
  password_confirm: string,
  phone_number?: string,
  role: number,
}

export interface IStaff {
  first_name: string,
  last_name: string,
  roleId: number,
  departmentId: number,
  user_name: string
}

export interface IUserManagement {
  id: number | null,
  // index: number, 
  user_name: string, 
  last_name: string, 
  first_name: string, 
  email: string,
  status: string,
  phone_number: string,
  avatar: string,
  department: IDepartment | null,
  position: IDepartment | null,
  role: IRolePermission[], 
  // boss: string,
}

export interface IUserRequest {
  id?: number | null,
  user_name: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number?: string,
  password?: string,
  password_confirm?: string,
  avatar?: string,
  departmentId?: number | null,
  positionId?: number | null,
  roleIds?: number[],
  status: string
}

export interface IUserCreateRequest {
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
  departmentId: number | null;
  positionId: number | null;
  roleIds: number[];
  status: string;
  phone_number?: string;
  avatar?: string;
}

export interface IUserUpdateRequest {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  departmentId: number | null;
  positionId: number | null;
  roleIds: number[];
  status: string;
  phone_number?: string;
  avatar?: string;
  password?: string; // optional, chỉ gửi nếu muốn đổi
}
