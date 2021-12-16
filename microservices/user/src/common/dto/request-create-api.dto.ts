import { IsInt, IsDefined, IsDate, Min, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestCreateApiDto {
  @IsDefined()
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  userId: number;

  @IsNotEmpty()
  @Transform((value) => !new Date(value) ? null : new Date(value))
  @IsDate()
  expirationDate: Date;

  @IsDefined()
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(0)
  coinsToBeWithdrawn: number;

  @IsDefined()
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(0)
  coinsWithdrawn: number;
}
