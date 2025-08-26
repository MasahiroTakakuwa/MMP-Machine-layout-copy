import { User } from './users.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: User;

  // Refresh token để quản lý đăng nhập dài hạn
  @Column('text')
  refresh_token: string;

  // Nếu bạn muốn support multi-device, nên có device info
  @Column({ nullable: true })
  user_agent?: string;

  @Column({ nullable: true })
  ip_address?: string;

  @Column({ type: 'timestamp' })
  expired_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
