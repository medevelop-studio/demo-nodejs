import { UserLogTypeEnum } from '../../common/dictionary/user-log';

export class UserLogDto {
  constructor(
    public userId: number,
    public logType: UserLogTypeEnum,
    public dataString: string,
    public timestamp: string,
  ) {}
}
