
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('visit')
export class Visit {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 20})
    ip_address: string;

    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    precision: 0,
    })
    created_at: Date;

}