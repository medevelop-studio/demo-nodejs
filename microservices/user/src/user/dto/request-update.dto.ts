import { IsInt, IsOptional, Length, Min, IsDate, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RequestUpdateUserDto {
  @ApiProperty({ example: '5', description: 'User with this userID will update.' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  readonly userId: number;

  @ApiProperty({ example: 'string(minLength: 4, maxLength: 32)', description: 'User will change login on this value', nullable: true })
  @Length(4, 32)
  @IsOptional()
  login?: string;

  @ApiProperty({ example: 'string(minLength: 4, maxLength: 32)', description: 'User will create with this password' })
  @IsOptional()
  @IsString()
  @Length(4, 32)
  password?: string;

  @ApiProperty({ example: '5', description: 'User with this userID will update.' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @Min(0)
  @IsOptional()
  @IsInt()
  credits?: number;

  @ApiProperty({ example: '1319349133', description: 'User expiration date', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : new Date(Number(value) * 1000))
  @IsDate()
  @IsOptional()
  expirationDate?: Date;

  @ApiProperty({ example: '25', description: 'User max BC connections.' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  maxBcConnections?: number;

  @ApiProperty({ example: '25', description: 'Max lease count.' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  maxLeaseCount?: number;

  @ApiProperty({ example: 'string(minLength: 0, maxLength: 500)', description: 'Comment for user account.' })
  @IsString()
  @Length(0, 500)
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: '1', description: 'Id of bcServerId if it is defined' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  bcServerId?: number;

  @ApiProperty({ example: false, description: 'Need to show USED column for user.', nullable: true })
  @IsBoolean()
  @IsOptional()
  isShowingUsedColumn?: boolean;

  @ApiProperty({ example: false, description: 'Need to increase users counter.', nullable: true })
  @IsBoolean()
  @IsOptional()
  isIncreasingUseCounter?: boolean;

  @ApiProperty({ example: false, description: 'User has access for multilogin.', nullable: true })
  @IsBoolean()
  @IsOptional()
  isMultilogining?: boolean;
}
