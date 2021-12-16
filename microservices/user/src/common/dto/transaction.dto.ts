import { TransactionEnum } from '../../common/dictionary/transaction';

export class TransactionDto {
  id: number;
  type: TransactionEnum;
  target: number;
  amount: number;
  targetCurrentBalance: number;
  createDate: number;
}
