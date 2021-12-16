export class ApiErrorCodeDictionary {
  static USER_UID_IS_NOT_SET = 1;
  static USER_WITH_UID_IS_NOT_FOUND = 2;
  static USER_ACCOUNT_IS_EXPIRED = 3;
  static DEMO_USER_CANNOT_PERFORM_REQUESTS = 4;
  static CANNOT_TAKE_NEW_APP_BEFORE_PREVIOUS = 5;
  static REACHED_MAX_BC_CONNECTIONS_LIMIT = 6;
  static ID_IS_NOT_SET = 7;
  static ID_IS_NOT_VALID = 8;
  static REQUEST_ID_DOES_NOT_EXISTS = 9;
  static REQUEST_ID_DOES_NOT_BELONG_TO_USER = 10;
  static REQUEST_ID_HAS_BEEN_SUCCESSFULLY_COMPLETED = 11;
  static INACTIVE_AT_THE_MOMENT = 12;
  static FIDS_IS_NOT_SET = 13;
  static FIDS_IS_NOT_VALID = 14;
  static FIDS_IS_MORE_THAN_MAX_CONNECTIONS_LIMIT = 15;
  static OUT_OF_CREDITS = 16;
  static FREQUENT_REQUESTS = 17;
}

export enum ApiResponseErrorCodes {
  USER_UID_IS_NOT_SET = ApiErrorCodeDictionary.USER_UID_IS_NOT_SET,
  USER_WITH_UID_IS_NOT_FOUND = ApiErrorCodeDictionary.USER_WITH_UID_IS_NOT_FOUND,
  USER_ACCOUNT_IS_EXPIRED = ApiErrorCodeDictionary.USER_ACCOUNT_IS_EXPIRED,
  DEMO_USER_CANNOT_PERFORM_REQUESTS = ApiErrorCodeDictionary.DEMO_USER_CANNOT_PERFORM_REQUESTS,
  CANNOT_TAKE_NEW_APP_BEFORE_PREVIOUS = ApiErrorCodeDictionary.CANNOT_TAKE_NEW_APP_BEFORE_PREVIOUS,
  REACHED_MAX_BC_CONNECTIONS_LIMIT = ApiErrorCodeDictionary.REACHED_MAX_BC_CONNECTIONS_LIMIT,
  ID_IS_NOT_SET = ApiErrorCodeDictionary.ID_IS_NOT_SET,
  ID_IS_NOT_VALID = ApiErrorCodeDictionary.ID_IS_NOT_VALID,
  REQUEST_ID_DOES_NOT_EXISTS = ApiErrorCodeDictionary.REQUEST_ID_DOES_NOT_EXISTS,
  REQUEST_ID_DOES_NOT_BELONG_TO_USER = ApiErrorCodeDictionary.REQUEST_ID_DOES_NOT_BELONG_TO_USER,
  REQUEST_ID_HAS_BEEN_SUCCESSFULLY_COMPLETED = ApiErrorCodeDictionary.REQUEST_ID_HAS_BEEN_SUCCESSFULLY_COMPLETED,
  INACTIVE_AT_THE_MOMENT = ApiErrorCodeDictionary.INACTIVE_AT_THE_MOMENT,
  FIDS_IS_NOT_SET = ApiErrorCodeDictionary.FIDS_IS_NOT_SET,
  FIDS_IS_NOT_VALID = ApiErrorCodeDictionary.FIDS_IS_NOT_VALID,
  FIDS_IS_MORE_THAN_MAX_CONNECTIONS_LIMIT = ApiErrorCodeDictionary.FIDS_IS_MORE_THAN_MAX_CONNECTIONS_LIMIT,
  OUT_OF_CREDITS = ApiErrorCodeDictionary.OUT_OF_CREDITS,
  FREQUENT_REQUESTS = ApiErrorCodeDictionary.FREQUENT_REQUESTS,
}

export enum ApiResponseErrors {
  USER_UID_IS_NOT_SET = 'Required param \'userUid\' is not set.',
  USER_WITH_UID_IS_NOT_FOUND = 'User with such \'userUid\' doesn\'t exists.',
  USER_ACCOUNT_IS_EXPIRED = 'User\'s account has expired.',
  DEMO_USER_CANNOT_PERFORM_REQUESTS = 'Demo user cannot perform requests.',
  CANNOT_TAKE_NEW_APP_BEFORE_PREVIOUS = 'You cannot take new app before you not get your previous.',
  REACHED_MAX_BC_CONNECTIONS_LIMIT = 'You cannot activate this quantity of app, because it reached your Max BC Connections Limit: ',
  ID_IS_NOT_SET = 'GET \'id\' param is not set.',
  ID_IS_NOT_VALID = 'GET \'id\' param is not valid.',
  REQUEST_ID_DOES_NOT_EXISTS = 'Specified Request ID doesn\'t exists.',
  REQUEST_ID_DOES_NOT_BELONG_TO_USER = 'Specified Request ID doesn\'t belong to specified user.',
  REQUEST_ID_HAS_BEEN_SUCCESSFULLY_COMPLETED = 'Specified Request ID has been successfully completed.',
  INACTIVE_AT_THE_MOMENT = 'You need to wait, before requested Socks by specified Request ID became active: ',
  FIDS_IS_NOT_SET = 'Required param \'fids\' is not set.',
  FIDS_IS_NOT_VALID = 'Param \'fids\' is not valid.',
  FIDS_IS_MORE_THAN_MAX_CONNECTIONS_LIMIT = 'Fids count is more than user\'s \'max BC connection\' property.',
  OUT_OF_CREDITS = 'Out of credits.',
  FREQUENT_REQUESTS = 'Your requests are too frequent, please wait: ',
}

export enum ResponseStatusEnum {
  SUCCESS = 'success',
  FAILURE = 'failure',
}
