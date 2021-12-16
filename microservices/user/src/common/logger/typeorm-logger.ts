/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, QueryRunner } from 'typeorm';
import { createLogger, Logger as WinstonLogger, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as os from 'os';

export class TypeOrmLogger implements Logger {
  private readonly queryLogger: WinstonLogger;
  private readonly schemaLogger: WinstonLogger;

  constructor() {
    const options = () => ({
      format: format.json(),
      defaultMeta: { service: 'user-service-orm' },
      transports: [
        new (DailyRotateFile)({
          filename: `log/user-orm.%DATE%.${os.hostname()}.log`,
          datePattern: 'yyyy-MM-DD',
          level: 'debug',
          maxSize: 102400,
          maxFiles: '3d',
          zippedArchive: true,
        }),
      ],
    });
    this.queryLogger = createLogger(options());
    this.schemaLogger = createLogger(options());
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    this.queryLogger.log({
      level: 'debug',
      message: `${query} - ${JSON.stringify(parameters)}`,
      timestamp: new Date().toISOString(),
      label: 'ORM-logQuery',
    });
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    this.queryLogger.log({
      level: 'debug',
      error,
      message: `${query} - ${JSON.stringify(parameters)}`,
      timestamp: new Date().toISOString(),
      label: 'ORM-logQueryError',
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    this.queryLogger.log({
      level: 'debug',
      time,
      message: `${query} - ${JSON.stringify(parameters)}`,
      timestamp: new Date().toISOString(),
      label: 'ORM-logQuerySlow',
    });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    this.schemaLogger.log({
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      label: 'ORM-logSchemaBuild',
    });
  }

  logMigration(message: string, queryRunner?: QueryRunner): void {
    this.schemaLogger.log({
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      label: 'ORM-logMigration',
    });
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): void {
    this.schemaLogger.log({
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      label: 'ORM-log',
    });
  }
}
