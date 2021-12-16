import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RequestGetLogDto {
  @ApiProperty({ example: 'FGluY2x1ZGVfY29udGV4dF9', description: 'Pagination page number.', nullable: true })
  @IsOptional()
  @IsString()
  scrollId?: string = '';

  @ApiProperty({ example: '10', description: 'Amount log items per page.', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  amountPerPage?: number = 50;

  @ApiProperty({ example: '1319349133', description: 'date from filter.', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : new Date(Number(value) * 1000))
  @IsDate()
  @IsOptional()
  readonly date?: Date = new Date;
}
