import { Role } from './../../role/models/role.entity';
import { Permission } from './../../permission/models/permission.entity';
import { Department } from './../../department/models/departments.entity';

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('role_department_permission')
@Unique(['role', 'department', 'permission'])
export class RoleDepartmentPermission {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Role, { cascade: true })
    @JoinColumn()
    role: Role;

    @ManyToOne(() => Department, { cascade: true })
    @JoinColumn()
    department: Department;

    @ManyToOne(() => Permission, { cascade: true })
    @JoinColumn()
    permission: Permission;
}