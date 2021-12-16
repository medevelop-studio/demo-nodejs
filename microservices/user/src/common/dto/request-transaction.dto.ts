import { TransactionEnum } from '../dictionary/transaction';

export class RequestCreateTransactionDto {
  constructor(
    public targetId: number,
    public amount: number,
    public type: TransactionEnum,
    public targetCurrentBalance: number,
  ) {}
}
