export class LifeCycleDictionary {
  static APP_ACTIVE: number = 1;
  static APP_DELETED: number = 2;
}

export enum LifeCycleEnum {
  APP_ACTIVE = LifeCycleDictionary.APP_ACTIVE,
  APP_DELETED = LifeCycleDictionary.APP_DELETED,
}
