import { User } from './../../user/models/users.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('departments')
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, length: 50, comment: 'Tên bộ phận'})
    name: string;

    @OneToMany(() => User, user => user.department)
    users: User[];
}