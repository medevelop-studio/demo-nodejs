import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsDefined, IsEnum, IsInt, IsOptional } from 'class-validator';
import { AppStatsTypeEnum, StatsOrderEnum } from '../../common/dictionary/stats';

export class RequestGetStatsDto {
  @ApiProperty({ example: '1', description: 'stats order of application.', nullable: false })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsDefined()
  @IsEnum(StatsOrderEnum)
  readonly statsBy: StatsOrderEnum;

  @ApiProperty({ example: '1', description: 'id of application.', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @IsOptional()
  readonly applicationId?: number;

  @ApiProperty({ example: '1319349133', description: 'date from filter.', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : new Date(Number(value) * 1000))
  @IsDate()
  @IsOptional()
  readonly dateFrom?: Date;

  @ApiProperty({ example: '1319349133', description: 'date to filter.', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : new Date(Number(value) * 1000))
  @IsDate()
  @IsOptional()
  readonly dateTo?: Date;

  @ApiProperty({ example: '1', description: 'app status.', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @IsOptional()
  readonly status?: number;

  @ApiProperty({ example: '1', description: 'app type.', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @IsOptional()
  @IsEnum(AppStatsTypeEnum)
  readonly appType?: AppStatsTypeEnum;
}
