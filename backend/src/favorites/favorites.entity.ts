import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { User } from '../user/user.entity';
import { Biodata } from '../biodata/biodata.entity';

@Entity('favorites')
@Unique(['user', 'biodata']) // Prevent duplicate favorites
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Biodata, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'biodataId' })
  biodata: Biodata;

  @CreateDateColumn()
  createdAt: Date;
}