import { ColumnSetting } from '../dto/column-setting.dto';

export class UserDictionary {
  // User status
  static USER_STATUS_ACTIVE: number = 1;
  static USER_STATUS_BANNED: number = 2;
  static USER_STATUS_DELETED: number = 3;
}

export enum UserEnum {
  USER_STATUS_ACTIVE = UserDictionary.USER_STATUS_ACTIVE,
  USER_STATUS_BANNED = UserDictionary.USER_STATUS_BANNED,
  USER_STATUS_DELETED = UserDictionary.USER_STATUS_DELETED,
}

export class ColumnSettingDictionary {
  static COUNTER: number = 1;
  static DATE_TIME: number = 2;
  static HOSTNAME: number = 3;
  static COUNTRY_FULL: number = 4;
  static REGION_STATE: number = 5;
  static CITY: number = 6;
  static UPTIME: number = 7;
  static SYSTEM: number = 8;
  static TOTAL_USED: number = 12;
  static APPLICATION_ID: number = 14;
  static VERSION: number = 15;
}

export enum ColumnSettingEnum {
  COUNTER = ColumnSettingDictionary.COUNTER,
  DATE_TIME = ColumnSettingDictionary.DATE_TIME,
  COUNTRY_FULL = ColumnSettingDictionary.COUNTRY_FULL,
  REGION_STATE = ColumnSettingDictionary.REGION_STATE,
  CITY = ColumnSettingDictionary.CITY,
  UPTIME = ColumnSettingDictionary.UPTIME,
  VERSION = ColumnSettingDictionary.VERSION,
}

export const DefaultColumnSettings: ColumnSetting[] = [
  { enabled: true, type: ColumnSettingDictionary.COUNTER },
  { enabled: true, type: ColumnSettingDictionary.DATE_TIME },
  { enabled: true, type: ColumnSettingDictionary.COUNTRY_FULL },
  { enabled: true, type: ColumnSettingDictionary.REGION_STATE },
  { enabled: true, type: ColumnSettingDictionary.CITY },
  { enabled: true, type: ColumnSettingDictionary.UPTIME },
];

export class DefaultDisplaySettings {
  static ROWS_PER_PAGE: number = 50;
  static IS_SHOWING_COUNTRY_FLAG: boolean = true;
  static ORDER_BY: ColumnSettingEnum = ColumnSettingDictionary.APPLICATION_ID;
  static IS_ORDERING_DESCENDING: boolean = true;
  static MAX_BC_CONNECTIONS: number = 25;
  static MAX_LEASE_COUNT: number = 50;
  static IS_SOUNDS_ENABLE: boolean = true;
  static IS_SHOWING_USED_COLUMN: boolean = true;
  static IS_INCREASING_USE_COUNTER: boolean = true;
  static IS_MULTILOGINING: boolean = false;
}
