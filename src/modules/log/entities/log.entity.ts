import {
  CreateDateColumn,
  Entity,
  Index,
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
}
