import { IsInt, IsEnum, Length, IsString, IsDefined, IsOptional, IsDate, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PermissionEnum } from '../../common/dictionary/permission';

export class RequestCreateDto {
  @ApiProperty({ example: '1 - client, 2 - admin.', description: 'User will create with this permission level' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsDefined()
  @IsInt()
  @IsEnum(PermissionEnum)
  permissionLevel: PermissionEnum;

  @ApiProperty({ example: 'string(minLength: 4, maxLength: 32)', description: 'User will create with this login' })
  @IsDefined()
  @IsString()
  @Length(4, 32)
  login: string;

  @ApiProperty({ example: 'string(minLength: 4, maxLength: 32)', description: 'User will create with this password' })
  @IsDefined()
  @IsString()
  @Length(4, 32)
  password: string;

  @ApiProperty({ example: '1319349133', description: 'User expiration date', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : new Date(Number(value) * 1000))
  @IsDate()
  @IsOptional()
  expirationDate?: Date;

  @ApiProperty({ example: '100', description: 'Number of credits for user.' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @Min(0)
  @IsOptional()
  credits?: number;

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

  @ApiProperty({ example: 'string(minLength: 4, maxLength: 500)', description: 'Comment for user account.' })
  @IsString()
  @Length(4, 500)
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: '1', description: 'Id of bcServerId if it is defined' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsOptional()
  @Min(1)
  @IsInt()
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
