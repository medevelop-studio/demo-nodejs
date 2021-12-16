import { BackConnectStatusEnum, BackConnectTypeEnum } from '../dictionary/back-connect';

export class BackConnectDto {
  id: number;
  ip: string;
  port: number;
  type: BackConnectTypeEnum;
  status: BackConnectStatusEnum;
}
