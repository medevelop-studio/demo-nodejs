export class TransactionDictionary {
  static TRANSACTION_INCOMING: number = 1;
  static TRANSACTION_OUTGOING: number = 2;
}

export enum TransactionEnum {
  TRANSACTION_INCOMING = TransactionDictionary.TRANSACTION_INCOMING,
  TRANSACTION_OUTGOING = TransactionDictionary.TRANSACTION_OUTGOING,
}

export class TransactionLifeCycleDictionary {
  static TRANSACTION_ACTIVE: number = 1;
  static TRANSACTION_DELETED: number = 2;
}

export enum TransactionLifeCycleEnum {
  TRANSACTION_ACTIVE = TransactionLifeCycleDictionary.TRANSACTION_ACTIVE,
  TRANSACTION_DELETED = TransactionLifeCycleDictionary.TRANSACTION_DELETED,
}
