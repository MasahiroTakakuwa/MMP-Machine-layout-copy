import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('quality')
export class QualityPageEntity {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 50})
    type: string;

    @Column({ length: 50})
    title: string;

    @Column({ length: 500, nullable: true})
    image: string;

    @Column({ length: 500, nullable: true})
    image_jp: string;

    @Column({ type: 'longtext', nullable: true})
    feature: string;

    @Column({ type: 'longtext', nullable: true})
    feature_jp: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'create_time',
        precision: 0,
        })
        created_at: Date;

}