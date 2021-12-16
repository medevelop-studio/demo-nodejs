import { UserDto } from '../dto/user.dto';
import { PermissionEnum } from '../dictionary/permission';
import { UserEnum } from '../dictionary/user';

export class ProfileDto {
  constructor(user: UserDto) {
    return {
      id: user.id,
      permissionLevel: user.permissionLevel,
      login: user.login,
      status: user.status,
    };
  }
  id: number;
  permissionLevel: PermissionEnum;
  login: string;
  status: UserEnum;
}
