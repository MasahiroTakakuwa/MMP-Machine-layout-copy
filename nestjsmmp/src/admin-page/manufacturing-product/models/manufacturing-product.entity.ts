import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ManufacturingProductItem } from "./manufacturing-product-item.entity";


@Entity('manufacturing_product')
export class ManufacturingProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true, length: 100, comment: 'Trang con'})
    sub_page: string;

    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    precision: 0,
    comment: 'Thời gian khởi tạo'
    })
    created_at: Date;


    @OneToMany(() => ManufacturingProductItem, manufacturing_product_item => manufacturing_product_item.manufacturing_product)
    manufacturing_product_item: ManufacturingProductItem[];



}