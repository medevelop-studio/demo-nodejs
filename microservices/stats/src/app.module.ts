import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '@elastic/elasticsearch';
import { Env } from './common/dictionary/env';
import { TransactionModule } from './transaction/transaction.module';
import { Transaction } from './transaction/transaction.entity';
import { StatsModule } from './stats/stats.module';
import { Stats } from './stats/entities/stats.entity';
import { Application } from './entities/application.entity';
import { Country } from './entities/country.entity';
import { Region } from './entities/region.entity';
import { HealthModule } from './health/health.module';
import { StatsUnique } from './stats/entities/stats-unique.entity';
import { StatsNoDid } from './stats/entities/stats-no-did.entity';
import { History } from './entities/history.entity';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TypeOrmLogger } from './common/logger/typeorm-logger';

@Module({
  imports: [
    TypeOrmModule.forRoot({
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
    }),
    TransactionModule,
    StatsModule,
    HealthModule,
  ],
})

export class AppModule {
  static elasticClient: Client

  constructor() {
    AppModule.elasticClient = new Client({ node: Env.ELASTICSEARCH_URL });
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .exclude('health/check')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

