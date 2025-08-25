
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('social_timeline')
export class SocialTimeline {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, comment: 'social/environmental_protection' })
    page: string;

    @Column({ type: 'longtext', nullable: true, comment: 'Nội dung' })
    data_img: string;

    @Column({ type: 'longtext', nullable: true, comment: 'Nội dung' })
    data_img_jp: string;

    @Column({ type: 'longtext', nullable: true, comment: 'Tieu de' })
    main_content: string;

    @Column({ type: 'longtext', nullable: true, comment: 'Tieu de' })
    main_content_jp: string;

    @Column({ length: 20, nullable: true, comment: 'Thoi gian su kien' })
    timeline: string;

    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    precision: 0,
    })
    created_at: Date;

}