import { IRequest } from '../guards/uidGuard';

export class RequestIpHelper {
  public static getFromRequest(request: IRequest): string {
    let ip: string | string[] = request.headers['x-forwarded-for'] ?
      request.headers['x-forwarded-for'] :
      request.headers['x-real-ip'] ?
        request.headers['x-real-ip'] :
        request.connection.remoteAddress;

    if (ip && ip.length) {
      ip = typeof ip === 'string' ? (ip.split(','))[0] : ip[0];
    }

    return typeof ip === 'string' ? ip : '';
  }
}
