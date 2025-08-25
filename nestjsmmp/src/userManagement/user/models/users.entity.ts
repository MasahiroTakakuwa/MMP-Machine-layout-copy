import { Logs } from './../../../master-logs/models/master-logs.entity';
import { Department } from './../../department/models/departments.entity';
import { Role } from '../../role/models/role.entity';
import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true, length: 11, comment: 'Mã số nhân viên'})
    user_name: string;

    @Column({length: 20, comment: 'Tên nhân viên'})
    first_name: string;

    @Column({length: 50, comment: 'Họ và tên lót'})
    last_name: string;

    @Column({unique: true, length: 50, comment: 'Địa chỉ email'})
    email: string;

    @Column({length: 100, comment: 'Mật khẩu'})
    @Exclude()
    password: string;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn()
    role: Role;

    @ManyToOne(() => Department, department => department.users)
    @JoinColumn()
    department: Department;

    @Column({length: 11, comment: 'Trạng thái tài khoản'})
    status: string;

    @Column({length: 20, nullable: true, comment: 'Số điện thoại'})
    phone_number: string;

    @Column({length: 100, nullable: true, comment: 'Hình ảnh đại diện'})
    avatar: string;

    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    precision: 0,
    comment: 'Thời gian khởi tạo'
    })
    created_at: Date;

    @OneToMany(() => Logs, logs => logs.users)
    logs: Logs[];





}