import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { RequestFindOneByUidDto } from '../dto/request-find-one-by-uid.dto';
import { validateOrReject } from 'class-validator';
import { ApiResponseErrorCodes } from '../dictionary/errors';
import { UserDto } from '../dto/user.dto';
import { ApiErrorDto } from '../dto/api-error.dto';

export interface IRequest extends Omit<Request, 'body'|'query'> {
  body: { userUid?: string };
  query: { userUid?: string };
  user?: UserDto;
  connection: { remoteAddress: string };
}

@Injectable()
export class UidGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    const userUid: string = request.query.userUid;

    try {
      const requestFindOneByUidDto: RequestFindOneByUidDto = new RequestFindOneByUidDto(userUid);
      await validateOrReject(requestFindOneByUidDto);
    } catch (err) {
      throw new HttpException(new ApiErrorDto(ApiResponseErrorCodes.USER_UID_IS_NOT_SET), HttpStatus.BAD_REQUEST);
    }

    return true;
  }
}
