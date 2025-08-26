export interface IPermission {
  id: number | string,
  name: string,
  describe?: string
}

export interface IPermissionById {
  id: number, 
  permissionId: number, 
  permissionName: string, 
  permissionDescribe: string
}
