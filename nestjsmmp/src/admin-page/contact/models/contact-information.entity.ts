import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('contact_info')
export class ContactInformation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 200, comment: 'Tên Địa chỉ công ty'})
    address_name: string;

    @Column({type: 'longtext', comment: 'Địa chỉ công ty'})
    address: string;

    @Column({length: 50, comment: 'Email phòng kinh doanh'})
    email: string;

    @Column({length: 20, comment: 'Số điện thoại công ty | Phòng kinh doanh'})
    phone: string;

    @Column({length: 20, comment: 'Số điện thoại bàn công ty | Phòng kinh doanh'})
    tel: string;

    @Column({length: 20, comment: 'Link facebook công ty', nullable:true})
    facebook: string;

    @Column({length: 20, comment: 'Link youtube công ty', nullable:true})
    youtube: string;

    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    precision: 0,
    comment: 'Thời gian khởi tạo'
    })
    created_at: Date;





}