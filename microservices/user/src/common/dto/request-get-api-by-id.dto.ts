import { IsDefined, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RequestGetByIdApiDto {
  @ApiProperty({ example: '5', description: 'Use to select and get user.' })
  @IsDefined()
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  id: number;
}
