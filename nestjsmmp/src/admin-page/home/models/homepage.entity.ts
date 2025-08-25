import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('homepage')
export class HomePage {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 20})
    type: string;

    @Column({ type:'longtext', nullable: true})
    discription: string;

    @Column({ type:'longtext', nullable: true})
    sub_discription: string;

    @Column({ length: 500, nullable: true})
    image: string;

    @Column({ type:'longtext', nullable: true})
    discription_jp: string;

    @Column({ type:'longtext', nullable: true})
    sub_discription_jp: string;

    @Column({ length: 500, nullable: true})
    image_jp: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'create_time',
        precision: 0,
        })
        created_at: Date;

}