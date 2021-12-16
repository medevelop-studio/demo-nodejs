import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Api } from '../entity/api.entity';
import { DisplaySettings } from '../entity/display-settings.entity';
import { UserLog } from '../entity/user-log.entity';
import { User } from '../entity/user.entity';
import { TypeOrmLogger } from '../logger/typeorm-logger';
import { Env } from './env';

const OrmOptions = {
  type: 'postgres',
  host: Env.DB_HOST,
  database: Env.DB_NAME,
  port: Env.DB_PORT,
  username: Env.DB_USER,
  password: Env.DB_PASS,
  entities: [User, DisplaySettings, Api, UserLog],
  synchronize: false,
  logging: Env.DEBUG_ORM ? 'all' : false,
  maxQueryExecutionTime: 1000,
  logger: Env.DEBUG_ORM ? new TypeOrmLogger() : null,
} as TypeOrmModuleOptions;

export = OrmOptions;
