import { User } from '../../user/models/users.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, length: 50, comment: 'Tên chức vụ'})
    name: string;

    @OneToMany(() => User, user => user.role)
    users: User[];

}