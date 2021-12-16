import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsInt, Min } from 'class-validator';

export class RemoveOutDatedDto {
  @ApiProperty({ example: '1337', description: 'Life time in seconds.', nullable: false })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsDefined()
  @IsInt()
  @Min(0)
  readonly lifetime: number;
}
