import { ApiStatusEnum } from '../../common/dictionary/api';
import { Api } from '../../common/entity/api.entity';
import { AuthInfo } from '../../user/dto/auth-info.dto';
import { UserDto } from './user.dto';

export class ApiDto {
  id: number;
  user: UserDto;
  expirationDate: Date;
  status: ApiStatusEnum;

  constructor(api: Api) {
    return {
      id: api.id,
      user: new UserDto({
        ...api.user,
        authInfo: typeof api.user.authInfo === 'object' ? JSON.stringify(api.user.authInfo) as unknown as AuthInfo[] : api.user.authInfo,
      }),
      expirationDate: api.expirationDate,
      status: api.status,
    };
  }
}
