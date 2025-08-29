import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('schedule_stop_machine_current')
export class ScheduleStopMachineCurrent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: 'Id machine' })
    machine_status_history_id: number

    @Column({ comment: 'Date start stop machine', length: 255 })
    date_start: string;

    @Column({ comment: 'Date end stop machine', length: 255, nullable: true })
    date_end: string;

    @Column({ comment: 'Shift top machine (1: day, 2: night)', nullable: true })
    shift: number;

    @Column({type: 'longtext', comment: 'Reason stop machine' })
    content: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at',
        precision: 0,
        comment: 'Time create data'
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        name: 'updated_at',
        precision: 0,
        comment: 'Time update data'
    })
    updated_at: Date;
}