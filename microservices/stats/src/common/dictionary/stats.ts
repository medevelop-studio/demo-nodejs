export class StatsDictionary {
  static GOOD_APP: number = 1;
  static APP_HAS_BLACKLISTED_BY_IP: number = 2;
  static APP_HAS_BLACKLISTED_BY_COUNTRY: number = 3;
}

export class StatsOrderDictionary {
  static BY_DATE: number = 1;
  static BY_APP: number = 2;
}

export class StatsNewRequestDictionary {
  static SHOW_GOOD_APP: number = 1;
  static SHOW_BLACKLISTED_APP: number = 2;
}

export enum StatsEnum {
  GOOD_APP = StatsDictionary.GOOD_APP,
  APP_HAS_BLACKLISTED_BY_IP = StatsDictionary.APP_HAS_BLACKLISTED_BY_IP,
  APP_HAS_BLACKLISTED_BY_COUNTRY = StatsDictionary.APP_HAS_BLACKLISTED_BY_COUNTRY,
}

export enum StatsNewRequestEnum {
  SHOW_GOOD_APP = StatsNewRequestDictionary.SHOW_GOOD_APP,
  SHOW_BLACKLISTED_APP = StatsNewRequestDictionary.SHOW_BLACKLISTED_APP,
}

export enum StatsOrderEnum {
  BY_DATE = StatsOrderDictionary.BY_DATE,
  BY_APP = StatsOrderDictionary.BY_APP,
}

export class AppStatsTypeDictionary {
  static NEW_APP: number = 1;
  static OLD_APP: number = 2;
}

export enum AppStatsTypeEnum {
  NEW_APP = AppStatsTypeDictionary.NEW_APP,
  OLD_APP = AppStatsTypeDictionary.OLD_APP,
}

export class AppLifeCycleDictionary {
  static APP_ACTIVE: number = 1;
  static APP_DELETED: number = 2;
}

export enum AppLifeCycleEnum {
  APP_ACTIVE = AppLifeCycleDictionary.APP_ACTIVE,
  APP_DELETED = AppLifeCycleDictionary.APP_DELETED,
}

export class StatsLifeCycleDictionary {
  static STATS_ACTIVE: number = 1;
  static STATS_DELETED: number = 2;
}

export enum StatsLifeCycleEnum {
  STATS_ACTIVE = StatsLifeCycleDictionary.STATS_ACTIVE,
  STATS_DELETED = StatsLifeCycleDictionary.STATS_DELETED,
}
