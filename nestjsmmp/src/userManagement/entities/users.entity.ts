import { UserToken } from './user-tokens.entity';
import { Position } from './position.entity';
import { Role } from './role.entity';
import { Department } from './departments.entity';
import { Logs } from '../../master-logs/models/master-logs.entity';
import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 11, comment: 'Mã số nhân viên' })
    user_name: string;

    @Column({ length: 20, comment: 'Tên nhân viên' })
    first_name: string;

    @Column({ length: 50, comment: 'Họ và tên lót' })
    last_name: string;

    @Column({ unique: true, length: 50, comment: 'Địa chỉ email' })
    email: string;

    @Column({ length: 100, comment: 'Mật khẩu' })
    @Exclude()
    password: string;

    // Liên kết Role N-N
    @ManyToMany(() => Role, (role) => role.users, { cascade: true })
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[];

    // Liên kết Department 1-N
    @ManyToOne(() => Department, (department) => department.users, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'department_id' })
    department: Department;

    // Liên kết Position 1-N
    @ManyToOne(() => Position, (position) => position.users, { eager: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'position_id' })
    position: Position;

    @Column({ length: 11, comment: 'Trạng thái tài khoản', default: 'active' })
    status: string;

    @Column({ length: 20, nullable: true, comment: 'Số điện thoại' })
    phone_number: string;

    @Column({ length: 100, nullable: true, comment: 'Hình ảnh đại diện' })
    avatar: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at',
        precision: 0,
        comment: 'Thời gian khởi tạo',
    })
    created_at: Date;

    @OneToMany(() => Logs, (logs) => logs.users)
    logs: Logs[];

    @OneToMany(() => UserToken, (token) => token.user)
    tokens: UserToken[];
}

