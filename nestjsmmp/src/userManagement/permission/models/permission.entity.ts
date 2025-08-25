// import { Department } from './../../department/models/departments.entity';
import { Role } from './../../role/models/role.entity';

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, length: 50, comment: 'Tên phân quyền'})
    name : string;

    @Column({length: 50, comment: 'Diễn tả phân quyền'})
    describe: string;

}