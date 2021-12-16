import { Transform } from 'class-transformer';
import { IsDefined, IsEnum, IsInt, IsIP, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { UserLogTypeEnum } from '../../common/dictionary/user-log';

export class RequestWriteLogDto {
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsDefined()
  @IsInt()
  @Min(1)
  userId: number;

  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsDefined()
  @IsEnum(UserLogTypeEnum)
  actionType: UserLogTypeEnum;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  userIp: string;

  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  requestId?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  wrongPassword?: string;

  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  coinsWithdrawn?: number;

  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  coinsLeft?: number;

  @IsOptional()
  @IsNotEmpty()
  trustedIps?: string;

  @IsOptional()
  @IsNotEmpty()
  unAuthIps?: string;
}
