
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('social')
export class Social {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, comment: 'social/environmental_protection' })
    page: string;

    @Column({ type: 'longtext', nullable: true, comment: 'Nội dung' })
    content_img: string;

    @Column({ type: 'longtext', nullable: true, comment: 'Tieu de' })
    main_content: string;

    @Column({ length: 200, comment: 'Hinh anh' })
    images: string;

    @Column({ length: 20, comment: 'size hinh (full/half)' })
    size_img: string;

    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    precision: 0,
    })
    created_at: Date;

}