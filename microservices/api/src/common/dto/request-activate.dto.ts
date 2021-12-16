import { RequestDebugDto } from './request-debug.dto';

export class RequestActivateDto extends RequestDebugDto {
  constructor(
    did: number,
    isActivation: boolean,
    isDebug: boolean,
    public delay: number,
    public hash: string,
  ) {
    super(did, isActivation, isDebug);
  }
}
