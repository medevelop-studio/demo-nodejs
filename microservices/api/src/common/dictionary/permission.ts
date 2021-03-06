export class PermissionDictionary {
  static USER_DEMO_PERMISSION_LEVEL: number = -1;
  static USER_CLIENT_PERMISSION_LEVEL: number = 1;
  static USER_ADMIN_PERMISSION_LEVEL: number = 2;
  static USER_SERVICE_PERMISSION_LEVEL: number = 3;
}

export enum PermissionEnum {
  USER_DEMO_PERMISSION_LEVEL = PermissionDictionary.USER_DEMO_PERMISSION_LEVEL,
  USER_CLIENT_PERMISSION_LEVEL = PermissionDictionary.USER_CLIENT_PERMISSION_LEVEL,
  USER_ADMIN_PERMISSION_LEVEL = PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL,
  USER_SERVICE_PERMISSION_LEVEL = PermissionDictionary.USER_SERVICE_PERMISSION_LEVEL,
}
