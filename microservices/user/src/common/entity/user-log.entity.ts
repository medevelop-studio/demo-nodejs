import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { UserLogTypeEnum } from '../dictionary/user-log';

@Entity()
export class UserLog {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: UserLogTypeEnum })
  logType: UserLogTypeEnum;

  @Index()
  @Column({ nullable: false })
  userId: number;

  @Column()
  dataString: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
