import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { Biodata } from '../biodata.entity';

@Entity('profile_views')
export class ProfileView {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Biodata, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'biodataId' })
  biodata: Biodata;

  @Column()
  biodataId: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'viewerId' })
  viewer: User;

  @Column({ nullable: true })
  viewerId: number;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  viewedAt: Date;
}