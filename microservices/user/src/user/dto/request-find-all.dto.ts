import { IsInt, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RequestGetUserDto {
  @ApiProperty({ example: 'testUser', description: 'Search property.', nullable: true })
  @IsOptional()
  params?: string;

  @ApiProperty({ example: '10', description: 'Pagination page number.', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  readonly pageNumber: number = 1;

  @ApiProperty({ example: '10', description: 'Amount user items per page.', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  readonly amountPerPage: number = 10;
}
