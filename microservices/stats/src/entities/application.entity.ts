import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { ApplicationDictionary, ApplicationEnum } from '../common/dictionary/application';

@Entity()
export class Application {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index({ unique: true })
  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Index()
  @Column({ nullable: false, select: false })
  restKey: string;

  @Column({
    type: 'enum',
    enum: ApplicationEnum,
    unique: false,
    default: ApplicationDictionary.APPLICATION_STATUS_ACTIVE,
  })
  status: ApplicationEnum;

  constructor(name: string, restKey: string, status?: number) {
    this.name = name;
    this.restKey = restKey;
    this.status = status;
  }
}
