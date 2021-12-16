import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayloadData } from '../dto/jwt-payload.dto';

interface Request {
  jwtPayloadData: JwtPayloadData
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private minLevel?: number) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const jwtPayloadData: JwtPayloadData = request.jwtPayloadData;

    if (!jwtPayloadData?.PermissionLevel || jwtPayloadData?.PermissionLevel < this.minLevel) {
      throw new HttpException('You don\'t have permission for this operation.', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
