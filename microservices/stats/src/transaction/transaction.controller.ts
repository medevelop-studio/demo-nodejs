import { Controller, UseGuards, Post, Get, Body } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { TransactionService } from './transaction.service';
import { TransactionDictionary } from '../common/dictionary/transaction';
import { TransactionDto } from './dto/transaction.dto';
import { RequestCreateTransactionDto } from './dto/request-create-transaction.dto';
import { CheckAuthHttpGuard } from '../common/check.strategy';
import { PermissionGuard } from '../common/guards/permission.guard';
import { PermissionDictionary } from '../common/dictionary/permission';
import { RemoveOutDatedDto } from './dto/request-remove-out-date.dto';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
  ) {}

  @UseGuards(CheckAuthHttpGuard)
  @Get('info')
  info(): unknown {
    return { info: [
      { key: 'balance/type', value: { ...TransactionDictionary } },
    ] };
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_SERVICE_PERMISSION_LEVEL))
  @Post('create')
  create(@Body() data: RequestCreateTransactionDto): Promise<TransactionDto> {
    return this.transactionService.create(data);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_SERVICE_PERMISSION_LEVEL))
  @Post('removeOutdatedTransaction')
  removeOutdatedTransaction(@Body() data: RemoveOutDatedDto): Promise<UpdateResult> {
    return this.transactionService.removeOutdatedTransaction(data);
  }
}
