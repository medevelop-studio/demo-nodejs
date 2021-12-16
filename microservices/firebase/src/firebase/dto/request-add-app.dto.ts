import { IsDate, IsDefined, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestAddAppDto {
  @IsDefined()
  @Transform(value => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  readonly id: number;

  @IsDefined()
  @Transform(value => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  readonly appId: number;

  @IsNotEmpty()
  @IsString()
  readonly Host: string;

  @IsDefined()
  @Transform(value => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  readonly countryId: number;

  @IsDefined()
  @Transform((value) => Number.isNaN(Number(value)) ? null : new Date(Number(value)))
  @IsDate()
  readonly date: Date;
}
