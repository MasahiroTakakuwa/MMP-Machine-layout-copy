import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('recruitment_email')
export class RecruitmentEmail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50, comment: '', unique:true})
    email: string;
}