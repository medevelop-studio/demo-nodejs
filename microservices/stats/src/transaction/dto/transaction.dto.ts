import { Transaction } from '../transaction.entity';
import { TransactionEnum } from '../../common/dictionary/transaction';

export class TransactionDto {
  constructor(transaction: Transaction) {
    return {
      id: transaction.id,
      type: transaction.type,
      target: transaction.target,
      amount: transaction.amount,
      targetCurrentBalance: transaction.targetCurrentBalance,
      createDate: new Date(transaction.createDate).getTime(),
    };
  }

  id: number;
  type: TransactionEnum;
  target: number;
  amount: number;
  targetCurrentBalance: number;
  createDate: number;
}
