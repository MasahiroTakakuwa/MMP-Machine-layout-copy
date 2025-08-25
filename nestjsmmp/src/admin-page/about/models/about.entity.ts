import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('about')
export class About {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100, comment: 'Mô tả'})
    describe: string;

    @Column({length: 100, comment: 'item'})
    item: string;

    @Column({type: 'longtext', comment: 'Nội dung tiếng anh', nullable: true})
    content: string;

    @Column({type: 'longtext', comment: 'Nội dung tiếng nhật', nullable: true})
    content_jp: string;

    @Column({length: 200, comment: 'Hình ảnh', nullable: true})
    img: string;

    @Column({length: 200, comment: 'Hình ảnh tiếng Nhật', nullable: true})
    img_jp: string;

    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    precision: 0,
    comment: 'Thời gian khởi tạo'
    })
    created_at: Date;





}