import { User } from './users.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @OneToMany(() => User, (user) => user.position)
  users: User[];
}