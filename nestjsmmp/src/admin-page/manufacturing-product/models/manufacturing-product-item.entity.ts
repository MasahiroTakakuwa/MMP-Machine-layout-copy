import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ManufacturingProduct } from "./manufacturing-product.entity";

@Entity('manufacturing_product_item')
export class ManufacturingProductItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 200, comment: 'Mô tả'})
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

    @ManyToOne(() => ManufacturingProduct, manufacturing_product => manufacturing_product.manufacturing_product_item)
    @JoinColumn()
    manufacturing_product: ManufacturingProduct;

    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    precision: 0,
    comment: 'Thời gian khởi tạo'
    })
    created_at: Date;






}