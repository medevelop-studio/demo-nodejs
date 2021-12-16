import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from '../../app.module';
import { JwtPayloadData } from '../dto/jwt-payload.dto';
import { LogEntryRequestDto } from '../dto/log-entry.dto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  use(request: Request, response: Response, next: NextFunction) {
    const dateRequest: Date = new Date();
    const dataTransferProperty: string = request.method.toUpperCase() === 'GET' ? 'query' : 'body';
    const body: string = request[dataTransferProperty];
    const requestToken: string = request.headers['authorization'];

    if (request) {
      const logEntry: LogEntryRequestDto = new LogEntryRequestDto(
        request.originalUrl,
        request.ip,
        request.method,
        new Date().toISOString(),
        request.url,
        body,
        requestToken,
      );

      AppModule.elasticClient.index({
        index: `log-firebase-info_${(new Date()).toISOString().split('T')[0]}`,
        body: {
          message: 'REQUEST',
          ...logEntry,
        },
      }).catch((err) => {
        console.log(err);
        console.log('========= ELASTICSEARCH =========');
      });
    }

    response.on('finish', () => {
      const dateResponse: Date = new Date();
      const requestAuth: JwtPayloadData = request['jwtPayloadData'];
      const logEntryResponse: LogEntryRequestDto = new LogEntryRequestDto(
        request.originalUrl,
        request.ip,
        request.method,
        dateResponse.toISOString(),
        request.url,
        body,
        requestToken,
        requestAuth,
        dateResponse.getTime() - dateRequest.getTime(),
      );

      AppModule.elasticClient.index({
        index: `log-firebase-info_${(new Date()).toISOString().split('T')[0]}`,
        body: {
          message: 'RESPONSE',
          ...logEntryResponse,
        },
      }).catch((err) => {
        console.log(err);
        console.log('========= ELASTICSEARCH =========');
      });
    });

    next();
  }
}
