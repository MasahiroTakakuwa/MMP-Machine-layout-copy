import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity('contact_us')
@Unique(['email', 'subject', 'message'])
export class ContactUs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100, comment: 'Tên người liên hệ'})
    name: string;

    @Column({length: 50, comment: 'Email người liên hệ'})
    email: string;

    @Column({length: 50, comment: 'Số điện thoại người liên hệ'})
    phone: string;

    @Column({length: 100, comment: 'Chủ đề'})
    subject: string;

    @Column({length: 100, comment: 'Nội dung | Tin nhắn liên hệ'})
    message: string;

    @Column({length: 100, comment: 'Trạng thái thông tin liên hệ (null | true : chưa đọc | đã đọc)', nullable: true, default: null})
    status: string;

    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    precision: 0,
    comment: 'Thời gian khởi tạo'
    })
    created_at: Date;





}