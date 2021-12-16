import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import {
  StatsLifeCycleDictionary,
  StatsLifeCycleEnum,
} from '../../common/dictionary/stats';
import { Application } from '../../entities/application.entity';

@Entity()
export class Stats {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  uniqueKey: string;

  @Index()
  @ManyToOne(() => Application)
  application: Application;

  @Index()
  @Column({ nullable: false, default: 0 })
  blacklistedByCountries: number;

  @Column({
    type: 'enum',
    enum: StatsLifeCycleEnum,
    unique: false,
    default: StatsLifeCycleDictionary.STATS_ACTIVE,
  })
  lifeCycle: StatsLifeCycleEnum;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updateDate: number;

  @VersionColumn({ type: 'smallint', unsigned: true, select: false })
  version: number;

  constructor(
    uniqueKey: string,
    application: Application,
    createDate: Date,
    blacklistedByCountries?: number,
  ) {
    this.uniqueKey = uniqueKey;
    this.application = application;
    this.createDate = createDate;
    this.blacklistedByCountries = blacklistedByCountries;
  }
}
