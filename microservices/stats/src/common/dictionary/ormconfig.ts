import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmLogger } from '../logger/typeorm-logger';
import { Env } from './env';
import { Transaction } from '../../transaction/transaction.entity';
import { Stats } from '../../stats/entities/stats.entity';
import { StatsUnique } from '../../stats/entities/stats-unique.entity';
import { StatsNoDid } from '../../stats/entities/stats-no-did.entity';
import { Application } from '../../entities/application.entity';
import { Country } from '../../entities/country.entity';
import { Region } from '../../entities/region.entity';

const OrmOptions = {
  type: 'postgres',
  host: Env.DB_HOST,
  database: Env.DB_NAME,
  port: Env.DB_PORT,
  username: Env.DB_USER,
  password: Env.DB_PASS,
  entities: [Transaction, Stats, StatsUnique, StatsNoDid, Application, Country, Region, History],
  synchronize: false,
  logging: Env.DEBUG_ORM ? 'all' : false,
  maxQueryExecutionTime: 1000,
  logger: Env.DEBUG_ORM ? new TypeOrmLogger() : null,
} as TypeOrmModuleOptions;

export = OrmOptions;
