import { IsDefined, IsEnum, IsUUID } from 'class-validator';
import { InvalidateSessionEnum } from '../dictionary/invalidate-session';

export class RequestInvalidateSessionDto {
  @IsDefined()
  @IsUUID()
  userUUID: string;

  @IsDefined()
  @IsEnum(InvalidateSessionEnum)
  type: InvalidateSessionEnum;
}
