export class HistoryStatusDictionary {
  static STATUS_WAITING = 1;
  static STATUS_ACTIVE = 2;
  static STATUS_CLOSED = 3;
  static STATUS_FAILED = 4;
}

export enum HistoryStatusEnum {
  STATUS_WAITING = HistoryStatusDictionary.STATUS_WAITING,
  STATUS_ACTIVE = HistoryStatusDictionary.STATUS_ACTIVE,
  STATUS_CLOSED = HistoryStatusDictionary.STATUS_CLOSED,
  STATUS_FAILED = HistoryStatusDictionary.STATUS_FAILED,
}
