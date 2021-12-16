import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { ApiStatusEnum } from '../dictionary/api';

const MONTH_IN_MILLISECONDS: number = 2678400000;

@Entity()
export class Api {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Index()
  @Column({ nullable: false, default: new Date(Date.now() + MONTH_IN_MILLISECONDS) })
  expirationDate: Date;

  @Index()
  @Column({
    type: 'enum',
    enum: ApiStatusEnum,
    unique: false,
    default: ApiStatusEnum.STATUS_PENDING,
  })
  status: ApiStatusEnum;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  createDate: number;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updateDate: number;

  @VersionColumn({ type: 'smallint', unsigned: true, select: false })
  version: number;

  constructor(params?: Partial<Api>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}
