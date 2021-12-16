import { IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserEnum } from '../../common/dictionary/user';

export class RequestBanUserDto {
  @ApiProperty({ example: '5', description: 'Use to identify user to ban.', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  readonly userId: number;

  @ApiProperty({ example: '1 - active, 2 - banned', description: 'New User status ban/unban', nullable: true })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @IsEnum(UserEnum)
  readonly userStatus: UserEnum;
}
