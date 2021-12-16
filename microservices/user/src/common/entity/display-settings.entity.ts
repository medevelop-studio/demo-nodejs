import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { ColumnSettingEnum, DefaultColumnSettings, DefaultDisplaySettings } from '../dictionary/user';
import { ColumnSetting } from '../dto/column-setting.dto';
import { User } from './user.entity';

@Entity()
export class DisplaySettings {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToOne(type => User, user => user.displaySettings)
  user: User;

  @Index()
  @Column('simple-array', { default: DefaultColumnSettings, nullable: false })
  columnsSettings: ColumnSetting[];

  @Column({ default: DefaultDisplaySettings.ROWS_PER_PAGE, nullable: false })
  rowsPerPage: number;

  @Column({
    type: 'enum',
    enum: ColumnSettingEnum,
    unique: false,
    default: DefaultDisplaySettings.ORDER_BY,
  })
  orderBy: ColumnSettingEnum;

  @Column({ default: DefaultDisplaySettings.IS_ORDERING_DESCENDING, nullable: false })
  isOrderingDescending: boolean;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  createDate: number;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updateDate: number;

  @VersionColumn({ type: 'smallint', unsigned: true, select: false })
  version: number;

  constructor(
    columnsSettings?: ColumnSetting[],
    rowsPerPage?: number,
    orderBy?: ColumnSettingEnum,
    isOrderingDescending?: boolean,
  ) {
    this.columnsSettings = columnsSettings;
    this.rowsPerPage = rowsPerPage;
    this.orderBy = orderBy;
    this.isOrderingDescending = isOrderingDescending;
  }
}

