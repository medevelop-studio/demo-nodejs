import { PermissionEnum } from '../dictionary/permission';

export class JwtPayloadData {
  PermissionLevel: PermissionEnum;
  UserID: number;
}
