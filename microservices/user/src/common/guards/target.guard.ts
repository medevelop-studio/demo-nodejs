import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { JwtPayloadData } from '../dto/jwt-payload.dto';
import { PermissionDictionary } from '../dictionary/permission';

interface IRequest extends Omit<Request, 'body'|'query'> {
  jwtPayloadData: JwtPayloadData;
  body: { userId?: number };
  query: { userId?: number };
}

@Injectable()
export class TargetGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    const dataTransferProperty: string = request.method.toUpperCase() === 'GET' ? 'query' : 'body';

    if (!request[dataTransferProperty].userId) {
      request[dataTransferProperty].userId = request.jwtPayloadData.UserID;
    }

    if (
      (
        request.jwtPayloadData.PermissionLevel < PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL &&
        Number(request[dataTransferProperty].userId) !== request.jwtPayloadData.UserID
      )
    ) {
      throw new HttpException('You don\'t have permission for this operation.', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
