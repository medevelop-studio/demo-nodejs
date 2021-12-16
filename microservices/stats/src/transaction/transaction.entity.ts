import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';

import {
  TransactionDictionary,
  TransactionEnum,
  TransactionLifeCycleDictionary,
  TransactionLifeCycleEnum,
} from '../common/dictionary/transaction';

@Entity()
export class Transaction {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({
    type: 'enum',
    enum: TransactionEnum,
    unique: false,
    default: TransactionDictionary.TRANSACTION_INCOMING,
  })
  type: TransactionEnum;

  @Index()
  @Column()
  target: number;

  @Index()
  @Column()
  amount: number;

  @Index()
  @Column({ default: 0 })
  targetCurrentBalance: number;

  @Column({
    type: 'enum',
    enum: TransactionLifeCycleEnum,
    unique: false,
    default: TransactionLifeCycleDictionary.TRANSACTION_ACTIVE,
  })
  lifeCycle: TransactionLifeCycleEnum;

  @CreateDateColumn({ type: 'timestamptz' })
  createDate: number;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updateDate: number;

  @VersionColumn({ type: 'smallint', unsigned: true, select: false })
  version: number;

  constructor(type: TransactionEnum, target: number, amount: number, targetCurrentBalance: number) {
    this.type = type;
    this.target = target;
    this.amount = amount;
    this.targetCurrentBalance = targetCurrentBalance;
  }
}
