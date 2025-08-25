import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jobs } from "./jobs.entity";

@Entity('jobs_description')
export class JobsDescription {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Jobs, (jobs) => jobs.description)
    // @JoinColumn()
    jobs: Jobs;

    @Column({length: 50, comment: 'position'})
    group_description_vi: string;

    @Column({length: 50, comment: 'position'})
    group_description_en: string;

    @Column({length: 50, comment: 'position'})
    group_description_jp: string;

    @Column({type: 'longtext', comment: 'Nhân viên kỹ thuật sản xuất', nullable: true})
    description_detail_vi: string;

    @Column({type: 'longtext', comment: 'Production Engineering', nullable: true})
    description_detail_en: string;

    @Column({type: 'longtext', comment: '', nullable: true})
    description_detail_jp: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'create_time',
        precision: 0,
        })
        created_at: Date;

}