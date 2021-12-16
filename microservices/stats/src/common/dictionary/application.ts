export class ApplicationDictionary {
  // APPLICATION status
  static APPLICATION_STATUS_ACTIVE: number = 1;
  static APPLICATION_STATUS_DELETED: number = 2;
}

export enum ApplicationEnum {
  APPLICATION_STATUS_ACTIVE = ApplicationDictionary.APPLICATION_STATUS_ACTIVE,
  APPLICATION_STATUS_DELETED = ApplicationDictionary.APPLICATION_STATUS_DELETED,
}
