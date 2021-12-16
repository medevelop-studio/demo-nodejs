import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import {
  StatsLifeCycleEnum,
  StatsLifeCycleDictionary,
} from '../../common/dictionary/stats';
import { Application } from '../../entities/application.entity';
import { Country } from '../../entities/country.entity';

@Entity()
export class StatsNoDid {
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
  @ManyToOne(() => Country)
  country: Country;

  @Index()
  @Column()
  os: string;

  @Index()
  @Column({ default: 0 })
  blacklistedCountries: number;

  @Index()
  @Column({
    type: 'enum',
    enum: StatsLifeCycleEnum,
    unique: false,
    default: StatsLifeCycleDictionary.STATS_ACTIVE,
  })
  lifeCycle: StatsLifeCycleEnum;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDate: Date;

  constructor(
    uniqueKey: string,
    application: Application,
    country: Country,
    blacklistedCountries: number,
  ) {
    this.uniqueKey = uniqueKey;
    this.application = application;
    this.country = country;
    this.blacklistedCountries = blacklistedCountries;
  }
}
