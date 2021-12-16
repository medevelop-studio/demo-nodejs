import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestFindOneByUidDto {
  @ApiProperty({ example: 'b024632c-4959-41d1-803b-ef15d2827727', description: 'Find one by uid.' })
  @IsString()
  @IsUUID()
  userUid: string;
}
