import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JobsDescription } from "./jobs-decription.entity";
import { CategoryJob } from "./categoryJob.entity";
@Entity('jobs')
export class Jobs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50, comment: 'Kỹ sư cơ khí'})
    name_vi: string;

    @Column({length: 50, comment: 'Kỹ sư cơ khí'})
    name_en: string;

    @Column({length: 50, comment: 'Kỹ sư cơ khí'})
    name_jp: string;

    @OneToMany(() => JobsDescription, (description) => description.jobs)
    description: JobsDescription[];
    
    @Column({length: 50, comment: 'Active/ Inactive'})
    status: string;

    @ManyToOne(() => CategoryJob, (category_job) => category_job.jobs)
    // @JoinColumn()
    category: CategoryJob;

    // @ManyToOne(() => Jobs, (jobs) => jobs.description)
    // @JoinColumn()
    // jobs: Jobs;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'create_time',
        precision: 0,
        })
        created_at: Date;
    
    @Column({type: 'longtext', comment: '', nullable: true})
    pdf_file: string;
}