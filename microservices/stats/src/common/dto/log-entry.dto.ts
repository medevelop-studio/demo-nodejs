import { JwtPayloadData } from './jwt-payload.dto';

export class LogEntryRequestDto {
  constructor(
    public originalUrl: string,
    public ip: string,
    public method: string,
    public timestamp: string,
    public url: string,
    public requestData: Record<string, unknown> | string,
    public requestToken: string,
    public requestAuth?: JwtPayloadData,
    public latency?: number,
  ) {}
}

export class LogEntryErrorDto {
  constructor(
    public statusCode: number,
    public message: string,
    public timestamp: string,
    public url: string,
    public requestData: string,
    public requestToken: string,
    public requestAuth: JwtPayloadData,
    public stack: string,
  ) {}
}
