import { PermissionEnum } from '../../common/dictionary/permission';
import { UserEnum } from '../../common/dictionary/user';
import { AuthInfo } from './auth-info.dto';
import { DisplaySettingsDto } from './display-settings.dto';

export class UserDto {
  id: number;
  permissionLevel: PermissionEnum;
  login: string;
  email: string;
  status: UserEnum;
  subId: string;
  expirationDate: Date;
  comment: string;
  isIncreasingUseCounter: boolean;
  isMultilogining: boolean;
  displaySettings: DisplaySettingsDto;
  authInfo: AuthInfo[];
}
