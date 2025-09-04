export interface IPermission {
  id: number | string,
  name: string,
  description?: string
}

export interface IPermissionById {
  id: number, 
  permissionId: number, 
  permissionName: string, 
  permissionDescribe: string
}

export interface IDepartment {
  id: number | string | null,
  name: string,
  description?: string
}

export interface IRolePermission{
  id: number | string | null,
  name: string,
  description?: string,
  permissions: IPermission[]
}
