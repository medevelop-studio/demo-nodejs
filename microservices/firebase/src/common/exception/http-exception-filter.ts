import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { AppModule } from '../../app.module';
import { JwtPayloadData } from '../dto/jwt-payload.dto';
import { LogEntryErrorDto } from '../dto/log-entry.dto';

interface IRequest extends Request {
  jwtPayloadData?: JwtPayloadData;
}

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: IRequest = ctx.getRequest<IRequest>();
    const response: Response = ctx.getResponse<Response>();
    const status: number = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    try {
      const dataTransferProperty: string = request.method.toUpperCase() === 'GET' ? 'query' : 'body';
      const requestData: string = request[dataTransferProperty];
      const requestToken: string = request.headers['authorization'];
      const requestAuth: JwtPayloadData = request?.jwtPayloadData;

      const logEntry: LogEntryErrorDto = new LogEntryErrorDto(
        status,
        exception.message,
        new Date().toISOString(),
        request.url,
        requestData,
        requestToken,
        requestAuth,
        exception.stack,
      );

      AppModule.elasticClient.index({
        index: `log-firebase-info_${(new Date()).toISOString().split('T')[0]}`,
        body: {
          message: exception.message,
          ...logEntry,
        },
      }).catch((err) => {
        console.log(err);
        console.log('========= ELASTICSEARCH =========');
      });
    // eslint-disable-next-line no-empty
    } catch (exp) {}

    try {
      const responseFromExp: unknown = exception.getResponse();

      response.status(status).json(
        typeof responseFromExp === 'string' ?
          {
            statusCode: exception.getStatus(),
            message: responseFromExp,
            error: exception.message,
          } :
          responseFromExp,
      );
    } catch (exp) {
      response.status(status).json({
        statusCode: 500,
        message: exception.message,
        error: 'Internal server error',
      });
    }
  }
}
