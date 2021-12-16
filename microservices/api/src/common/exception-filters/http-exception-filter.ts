import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { AppModule } from '../../app.module';
import { ApiResponseErrorCodes, ApiResponseErrors, ResponseStatusEnum } from '../dictionary/errors';
import { ApiErrorDto } from '../dto/api-error.dto';
import { JwtPayloadData } from '../dto/jwt-payload.dto';
import { LogEntryErrorDto } from '../dto/log-entry.dto';
import { UserDto } from '../dto/user.dto';

interface IRequest extends Request {
  user: UserDto;
  jwtPayloadData?: JwtPayloadData;
}

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: IRequest = ctx.getRequest<IRequest>();
    const response: Response = ctx.getResponse<Response>();

    try {
      const status: number = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      const dataTransferProperty: string = request.method.toUpperCase() === 'GET' ? 'query' : 'body';
      const requestData: string = request[dataTransferProperty];
      const requestToken: string = request.headers['authorization'];
      const requestAuth: JwtPayloadData = request?.jwtPayloadData;

      console.log('API ERR: ', exception.message, exception.stack);

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
        index: `log-api-info_${(new Date()).toISOString().split('T')[0]}`,
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

    if (!(exception instanceof HttpException)) {
      response.status(HttpStatus.BAD_REQUEST).json({
        status: ResponseStatusEnum.FAILURE,
        code: 500,
        message: 'Internal Server Error',
      });

      return;
    }

    const exceptionResponse: unknown = exception.getResponse();

    if (!Object.prototype.hasOwnProperty.call(exceptionResponse, 'code')) {
      response.status(HttpStatus.BAD_REQUEST).json({
        status: ResponseStatusEnum.FAILURE,
        code: 500,
        message: 'Internal Server Error',
      });

      return;
    }

    const validException: ApiErrorDto = exceptionResponse as ApiErrorDto;

    const code: number = validException.code;
    let message: string = ApiResponseErrors[ApiResponseErrorCodes[code]];

    if (
      code === ApiResponseErrorCodes.REACHED_MAX_BC_CONNECTIONS_LIMIT ||
      code === ApiResponseErrorCodes.INACTIVE_AT_THE_MOMENT ||
      code === ApiResponseErrorCodes.FREQUENT_REQUESTS
    ) {
      message += validException.data;
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      status: ResponseStatusEnum.FAILURE,
      code,
      message,
      url:
        code === ApiResponseErrorCodes.CANNOT_TAKE_NEW_APP_BEFORE_PREVIOUS
          ? `URL?userUid=${request.user.subId}`
          : undefined,
    });
  }
}
