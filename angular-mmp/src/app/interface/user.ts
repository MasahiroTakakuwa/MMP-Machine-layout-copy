import { IPermission } from "./permission"

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
  index: number, 
  user_name: string, 
  last_name: string, 
  first_name: string, 
  email: string, 
  department: IPermission, 
  role: IPermission, 
  boss: string, 
  status: string
}
