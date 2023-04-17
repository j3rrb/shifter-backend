import UserEntity from '@modules/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'auth',
})
@Index(['id'])
export default class AuthEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'hash', nullable: false })
  hash: string;

  @Column({ name: 'salt', nullable: false })
  salt: string;

  @UpdateDateColumn({ name: 'last_access' })
  lastAccess: string;

  @OneToMany(() => UserEntity, (entity) => entity.auth)
  @JoinColumn({ name: 'user_id' })
  users: UserEntity[];
}
