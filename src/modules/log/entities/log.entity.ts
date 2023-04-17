import UserEntity from '@modules/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'log',
})
@Index(['id'])
export default class LogEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @CreateDateColumn({
    name: 'time',
  })
  time: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
