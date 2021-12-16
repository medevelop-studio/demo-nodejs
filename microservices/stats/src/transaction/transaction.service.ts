
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { round } from 'mathjs';
import { Transaction } from './transaction.entity';
import { TransactionDto } from './dto/transaction.dto';
import { Finder } from '../common/base/finder';
import { RequestCreateTransactionDto } from './dto/request-create-transaction.dto';
import { TransactionLifeCycleDictionary } from '../common/dictionary/transaction';
import { RemoveOutDatedDto } from '../stats/dto/request-remove-out-dated.dto';

@Injectable()
export class TransactionService {
  private finder: Finder<Transaction>;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {
    this.finder = new Finder(transactionRepository);
  }

  public async create(data: RequestCreateTransactionDto): Promise<TransactionDto> {
    const transaction: Transaction = new Transaction(
      data.type,
      data.targetId,
      round(data.amount, 2),
      data.targetCurrentBalance,
    );

    return new TransactionDto(await this.transactionRepository.save(transaction));
  }

  public async removeOutdatedTransaction(data: RemoveOutDatedDto): Promise<UpdateResult> {
    return await this.transactionRepository
      .createQueryBuilder()
      .update(Transaction)
      .set({
        lifeCycle: TransactionLifeCycleDictionary.TRANSACTION_DELETED,
      })
      .where('createDate < :date', { date: new Date(Date.now() - (data.lifetime * 1000)) })
      .andWhere('lifeCycle = :lifeCycle', { lifeCycle: TransactionLifeCycleDictionary.TRANSACTION_ACTIVE })
      .execute();
  }
}
