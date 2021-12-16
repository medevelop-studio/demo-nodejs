import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsEnum } from 'class-validator';
import { ColumnSettingEnum } from '../../common/dictionary/user';

export class ColumnSetting {
  @IsBoolean()
  enabled: boolean;

  @Transform(value => Number.isNaN(Number(value)) ? null : Number(value))
  @IsInt()
  @IsEnum(ColumnSettingEnum)
  type: ColumnSettingEnum;

  constructor(enabled: boolean, type: ColumnSettingEnum) {
    this.enabled = enabled;
    this.type = type;
  }
}
