import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserDictionary, UserEnum } from '../dictionary/user';
import {
  PermissionDictionary,
  PermissionEnum,
} from '../dictionary/permission';
import { DisplaySettings } from './display-settings.entity';
import { DefaultDisplaySettings } from '../dictionary/user';
import { AuthInfo } from '../../user/dto/auth-info.dto';

const MONTH_IN_MILLISECONDS: number = 2678400000;

@Entity()
export class User {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({
    type: 'enum',
    enum: PermissionEnum,
    unique: false,
    default: PermissionDictionary.USER_CLIENT_PERMISSION_LEVEL,
  })
  permissionLevel: PermissionEnum;

  @Index({ unique: true })
  @Column({
    length: 32,
    unique: true,
    default: null,
  })
  login: string;

  @Index()
  @Column({
    default: null,
    nullable: true,
  })
  email: string;

  @Index()
  @Column({
    length: 150,
    default: null,
  })
  password: string;

  @Column({ nullable: false, default: new Date(Date.now() + MONTH_IN_MILLISECONDS) })
  expirationDate: Date;

  @Column({
    type: 'enum',
    enum: UserEnum,
    unique: false,
    default: UserDictionary.USER_STATUS_ACTIVE,
  })
  status: UserEnum;

  @Column({ type: 'boolean', default: false, nullable: false })
  isFromOldSystem: boolean;

  @Column({
    length: 500,
    default: null,
  })
  comment: string;


  @Column({ nullable: false, default: DefaultDisplaySettings.IS_SHOWING_USED_COLUMN })
  isShowingUsedColumn: boolean;

  @Column({ nullable: false, default: DefaultDisplaySettings.IS_INCREASING_USE_COUNTER })
  isIncreasingUseCounter: boolean;

  @Index()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToOne(type => DisplaySettings, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
  })
  @JoinColumn()
  displaySettings: DisplaySettings;

  @Index()
  @Column('simple-array', { nullable: true })
  authInfo: AuthInfo[];

  @CreateDateColumn({ type: 'timestamptz', select: false })
  createDate: number;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updateDate: number;

  @Column({ type: 'smallint', unsigned: true, select: false })
  version: number;

  constructor(
    permissionLevel: PermissionEnum,
    login: string,
    password: string,
    displaySettings: DisplaySettings,
    comment?: string,
    status?: UserEnum,
    expirationDate?: Date,
    email?: string,
    isShowingUsedColumn?: boolean,
    isIncreasingUseCounter?: boolean,
    authInfo?: AuthInfo,
  ) {
    this.permissionLevel = permissionLevel;
    this.login = login;
    this.password = password;
    this.email = email;
    this.comment = comment;
    this.status = status;
    this.expirationDate = expirationDate;
    this.displaySettings = displaySettings;
    this.isShowingUsedColumn = isShowingUsedColumn;
    this.isIncreasingUseCounter = isIncreasingUseCounter;
    this.authInfo = authInfo ? [(JSON.stringify(authInfo) as unknown) as AuthInfo] : null;
  }
}
