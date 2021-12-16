import { ColumnSettingEnum } from '../../common/dictionary/user';
import { DisplaySettings } from '../../common/entity/display-settings.entity';
import { ColumnSetting } from './column-setting.dto';

export class DisplaySettingsDto {
  constructor(displaySettings: DisplaySettings) {
    return {
      id: displaySettings.id,
      columnsSettings: displaySettings.columnsSettings,
      rowsPerPage: displaySettings.rowsPerPage,
      orderBy: displaySettings.orderBy,
      isOrderingDescending: displaySettings.isOrderingDescending,
    };
  }

  id: number;
  columnsSettings: ColumnSetting[];
  rowsPerPage: number;
  orderBy: ColumnSettingEnum;
  isOrderingDescending: boolean;
}
