export class InvalidateSessionDictionary {
  static TYPE_SESSION_EXPIRED = 1;
  static TYPE_CREDENTIALS_CHANGED = 2;
}

export enum InvalidateSessionEnum {
  SESSION_EXPIRED = InvalidateSessionDictionary.TYPE_SESSION_EXPIRED,
  CREDENTIALS_CHANGED = InvalidateSessionDictionary.TYPE_CREDENTIALS_CHANGED,
}
