import { SetMetadata } from "@nestjs/common";

export const HasPermission = (access: number) => SetMetadata('access', access);
// access is permission id 

