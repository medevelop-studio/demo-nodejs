import { ColumnSettingEnum } from '../../common/dictionary/user';
import { ColumnSetting } from './column-setting.dto';

export class DisplaySettingsDto {
  id: number;
  columnsSettings: ColumnSetting[];
  rowsPerPage: number;
  orderBy: ColumnSettingEnum;
  isOrderingDescending: boolean;
}
