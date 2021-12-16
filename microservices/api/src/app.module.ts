import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { HealthModule } from './health/health.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { Env } from './common/dictionary/env';

@Module({
  imports: [
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

