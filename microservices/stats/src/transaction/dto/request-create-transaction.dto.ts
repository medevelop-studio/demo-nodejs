import { IsInt, IsEnum, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionEnum } from '../../common/dictionary/transaction';

export class RequestCreateTransactionDto {
  @ApiProperty({ example: '5', description: 'Use to identify user to create transaction.' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  targetId: number;

  @ApiProperty({ example: '250', description: 'Set amount of transaction' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ example: '1 - incoming, 2 - outgoing', description: 'Transaction type' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @IsEnum(TransactionEnum)
  type: TransactionEnum;

  @ApiProperty({ example: '250', description: 'Current balance of user' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(0)
  targetCurrentBalance: number;
}
