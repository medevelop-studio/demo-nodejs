import { IsDefined, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestRefreshSearchApiDto {
  @IsDefined()
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  userId: number;
}
