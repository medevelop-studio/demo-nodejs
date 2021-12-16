import { IsArray, IsBoolean, IsInt, IsIP, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RequestEditUserDto {
  @ApiProperty({ example: '5', description: 'User with this userID will update.' })
  @Transform((value) => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  readonly userId: number;

  @ApiProperty({ example: 'string(minLength: 4, maxLength: 32)', description: 'User will change password on this value', nullable: true })
  @Length(4, 32)
  @IsOptional()
  password?: string;

  @ApiProperty({ example: ['192.168.0.0', '192.168.0.1'], description: 'Array of ips.', nullable: true })
  @IsArray()
  @IsIP(4, { each: true })
  @IsOptional()
  allowedIps?: string[];

  @ApiProperty({ example: false, description: 'User will enable or disable sounds', nullable: true })
  @IsBoolean()
  @IsOptional()
  isSoundsEnable?: boolean;
}
