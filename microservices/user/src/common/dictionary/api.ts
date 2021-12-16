export enum OsEnum {
  WINDOWS = 'WINDOWS%',
  ANDROID = 'ANDROID%',
}

export class ApiStatusDictionary {
  static STATUS_PENDING: number = 1;
  static STATUS_SUCCESS: number = 2;
  static STATUS_SEARCH: number = 3;
  static STATUS_DELETED: number = 4;
}

export enum ApiStatusEnum {
  STATUS_PENDING = ApiStatusDictionary.STATUS_PENDING,
  STATUS_SUCCESS = ApiStatusDictionary.STATUS_SUCCESS,
  STATUS_SEARCH = ApiStatusDictionary.STATUS_SEARCH,
  STATUS_DELETED = ApiStatusDictionary.STATUS_DELETED,
}

export class ApiConfigDictionary {
  static SECOND_TO_WAITING: number = 10;
}
