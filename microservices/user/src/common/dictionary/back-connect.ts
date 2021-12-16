export class BackConnectTypeDictionary {
  static GLOBAL_SERVER: number = 1;
  static PERSONAL_SERVER: number = 2;
}

export enum BackConnectTypeEnum {
  GLOBAL_SERVER = BackConnectTypeDictionary.GLOBAL_SERVER,
  PERSONAL_SERVER = BackConnectTypeDictionary.PERSONAL_SERVER,
}

export class BackConnectStatusDictionary {
  static STATUS_ACTIVE: number = 1;
  static STATUS_DISABLE: number = 2;
}

export enum BackConnectStatusEnum {
  STATUS_ACTIVE = BackConnectStatusDictionary.STATUS_ACTIVE,
  STATUS_DISABLE = BackConnectStatusDictionary.STATUS_DISABLE,
}
