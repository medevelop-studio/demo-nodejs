import { Module, HttpModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '@elastic/elasticsearch';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

import OrmOptions = require('./common/dictionary/ormconfig');
import { Env } from './common/dictionary/env';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot(OrmOptions),
    UserModule,
    HealthModule,
    AppModule,
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
