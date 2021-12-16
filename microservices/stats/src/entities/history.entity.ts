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
import { HistoryStatusDictionary, HistoryStatusEnum } from '../common/dictionary/history';
import { Application } from './application.entity';

@Entity()
export class History {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => Application, app => app.status, {
    onDelete: 'CASCADE',
  })
  app: Application;

  @Index()
  @Column({ nullable: false })
  userId: number;

  @Column({
    type: 'enum',
    enum: HistoryStatusEnum,
    default: HistoryStatusDictionary.STATUS_WAITING,
  })
  status: HistoryStatusEnum;

  @Column({ nullable: true })
  lastError: string;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  createDate: number;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updateDate: number;

  @VersionColumn({ type: 'smallint', unsigned: true, select: false })
  version: number;

  constructor(
    app: Application,
    userId: number,
    status?: HistoryStatusEnum,
  ) {
    this.app = app;
    this.userId = userId;
    this.status = status;
  }
}
