import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { Env } from './dictionary/env';
import { JwtPayloadData } from './dto/jwt-payload.dto';

export interface HttpRequest {
  headers: { authorization: string }
  jwtPayloadData: JwtPayloadData;
}

@Injectable()
export class CheckAuthHttpGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const reqData: HttpRequest = context.switchToHttp().getRequest();
    const config = {
      headers: { Authorization: reqData?.headers?.authorization },
    };

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable SSL certificate verification

    try {
      const res = await axios.post(`http://${Env.SERVICE_AUTH}/checkAuth`, { }, config);

      reqData.jwtPayloadData = res?.data?.response;
    } catch (err) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
