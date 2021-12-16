import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RequestFindOneByIdDto {
  @ApiProperty({ example: '5', description: 'Use to select and get user.' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @IsOptional()
  userId?: number;
}
