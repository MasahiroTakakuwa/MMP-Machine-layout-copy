import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Jobs } from "./jobs.entity";

@Entity('category_job')
export class CategoryJob {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50, comment: 'Hành chính Nhân sự'})
    name_vi: string;

    @Column({length: 50, comment: 'Hành chính Nhân sự'})
    name_en: string;

    @Column({length: 50, comment: 'Hành chính Nhân sự'})
    name_jp: string;

    @OneToMany(() => Jobs, (jobs) => jobs.category)
    jobs: Jobs[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'create_time',
        precision: 0,
        })
        created_at: Date;


}