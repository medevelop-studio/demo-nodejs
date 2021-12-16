import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class RequestGetUniqueCountDto {
  @ApiProperty({ example: [1, 2, 3, 4], description: 'Array.', nullable: false })
  @Transform((value: string[]) => value.map((item: string) => Number(item)))
  @IsInt({ each: true })
  readonly ids: number[];

  @ApiProperty({ example: 'host.example.com', description: 'Host of app', nullable: false })
  @IsNotEmpty()
  @IsString()
  readonly type: string;
}
