import AuthEntity from '@modules/auth/entities/auth.entity';
import LogEntity from '@modules/log/entities/log.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'user',
})
@Index(['id'])
export default class UserEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'name',
    nullable: false,
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    name: 'user_name',
    nullable: false,
    type: 'varchar',
    length: 25,
  })
  username: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToOne(() => LogEntity)
  @JoinColumn({ name: 'shift_start' })
  shiftStart?: LogEntity;

  @OneToOne(() => LogEntity)
  @JoinColumn({ name: 'break' })
  break?: LogEntity;

  @OneToOne(() => LogEntity)
  @JoinColumn({ name: 'break_return' })
  breakReturn?: LogEntity;

  @OneToOne(() => LogEntity)
  @JoinColumn({ name: 'shift_end' })
  shiftEnd?: LogEntity;

  @ManyToOne(() => AuthEntity)
  @JoinColumn({ name: 'auth_id' })
  auth: AuthEntity;

  @ManyToMany(() => LogEntity, (log) => log.id, { cascade: true })
  @JoinTable({ name: 'user_log' })
  logs: LogEntity[];
}
