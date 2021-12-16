import { User } from '../entity/user.entity';
import { PermissionEnum } from '../dictionary/permission';
import { UserEnum } from '../dictionary/user';
import { DisplaySettingsDto } from './display-settings.dto';
import { AuthInfo } from '../../user/dto/auth-info.dto';

export class UserDto {
  constructor(user: User) {
    return {
      id: user.id,
      permissionLevel: user.permissionLevel,
      login: user.login,
      email: user.email,
      status: user.status,
      expirationDate: user.expirationDate,
      displaySettings: new DisplaySettingsDto(user.displaySettings),
      authInfo: JSON.parse(user.authInfo as unknown as string),
      serverTime: new Date(),
    };
  }

  id: number;
  permissionLevel: PermissionEnum;
  login: string;
  email: string;
  status: UserEnum;
  expirationDate: Date;
  displaySettings: DisplaySettingsDto;
  authInfo: AuthInfo[];
  serverTime: Date;
}
