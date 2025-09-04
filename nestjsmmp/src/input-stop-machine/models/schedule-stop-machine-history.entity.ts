import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('schedule_stop_machine_history')
export class ScheduleStopMachineHistory {
    //primary key, auto increament
    @PrimaryGeneratedColumn()
    id: number;

    //machine id from DE_TBL_運転状態履歴
    @Column({ comment: 'Id machine' })
    machine_status_history_id: number

    //date start schedule stop machine
    @Column({ comment: 'Date start stop machine', length: 255 })
    date_start: string;

    //date stop schedule stop machine (can be null)
    @Column({ comment: 'Date end stop machine', length: 255, nullable: true })
    date_end: string;

    //shift in schedule stop machine (can be null)
    @Column({ comment: 'Shift top machine (1: day, 2: night)', nullable: true })
    shift: number;

    //reason stop machine
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