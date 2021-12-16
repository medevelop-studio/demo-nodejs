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
import { Region } from '../../entities/region.entity';

@Entity()
export class StatsUnique {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @ManyToOne(() => Country)
  country: Country;

  @Index()
  @ManyToOne(() => Region)
  region: Region;

  @Index()
  @ManyToOne(() => Application)
  app: Application;

  @Column()
  count: number;

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
    country: Country,
    region: Region,
    count: number,
  ) {
    this.country = country;
    this.region = region;
    this.count = count;
  }
}
