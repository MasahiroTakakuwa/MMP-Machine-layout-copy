import { User } from '../../userManagement/entities/users.entity';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity('logs')
export class Logs {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 20})
    ip_address: string;

    @ManyToOne(() => User, users => users.logs)
    @JoinColumn({ name: 'user_name', referencedColumnName: 'user_name'})
    users: User;

    @Column({length: 200})
    action: string;
    
    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    precision: 0,
    })
    created_at: Date;
}